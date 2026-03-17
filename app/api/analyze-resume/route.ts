import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-utils';
import dbConnect from '@/lib/db';
import Resume from '@/models/Resume';
import AnalysisResult from '@/models/AnalysisResult';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API,
});

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticate(req);
    
    if (authResult.error || !authResult.user) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const { resumeId } = await req.json();

    if (!resumeId) {
      return NextResponse.json({ message: 'Missing resumeId' }, { status: 400 });
    }

    await dbConnect();

    // Verify ownership
    const resume = await Resume.findById(resumeId);
    if (!resume || resume.userId.toString() !== authResult.user._id.toString()) {
      return NextResponse.json({ message: 'Resume not found or unauthorized' }, { status: 404 });
    }

    // Performance Optimization: check if already analyzed
    const existingAnalysis = await AnalysisResult.findOne({ resumeId });
    if (existingAnalysis) {
      console.log(`[Analyze API] Returning cached analysis for resume ${resumeId}`);
      return NextResponse.json(existingAnalysis, { status: 200 });
    }

    // Prepare Groq Prompt
    const systemPrompt = `You are an expert ATS (Applicant Tracking System) Analyzer and technical recruiter. 
Analyze the provided resume text and generate a detailed report.
Also, output an extremely clean, modern, and professional LaTeX template of the user's resume. 
CRITICAL RULES:
1. ONLY suggest missing skills if they are soft skills, general methodologies, or directly implied by existing experience. DO NOT hallucinate or suggest specific technical skills (like MySQL, React, AWS) unless the user already has them or they are an obvious missing component of a stack they already list.
2. Provide individual, actionable suggestions to improve existing bullet points by adding quantifiable metrics and better formatting. Ensure suggestions are specific to the resume.
3. Incorporate your formatting improvements cleanly into the LaTeX code.

Return the result STRICTLY as a JSON object matching this schema without markdown fences or any other text:
{
  "atsScore": (number 0-100),
  "detectedSkills": ["skill1", "skill2"],
  "missingSkills": ["missing1", "missing2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "latexCode": "\\\\documentclass{article}...\\\\begin{document}...\\\\end{document}"
}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: resume.parsedText }
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.2, // Low temperature for consistent JSON
      response_format: { type: "json_object" }
    });

    const aiResponseContent = chatCompletion.choices[0]?.message?.content || '{}';
    let aiData;
    
    try {
      aiData = JSON.parse(aiResponseContent);
    } catch (parseError) {
      console.error('Failed to parse Groq response:', aiResponseContent);
      return NextResponse.json({ message: 'AI returned invalid data format' }, { status: 500 });
    }

    // Validate expected fields exist
    const {
      atsScore = 0,
      detectedSkills = [],
      missingSkills = [],
      suggestions = [],
      latexCode = ''
    } = aiData;

    // Save to DB
    const newAnalysis = await AnalysisResult.create({
      resumeId: resume._id,
      userId: authResult.user._id,
      atsScore,
      detectedSkills,
      missingSkills,
      suggestions,
      latexCode,
    });

    console.log(`[Analyze API] Analyzed and saved result for resume ${resumeId}`);

    return NextResponse.json(newAnalysis, { status: 200 });

  } catch (error: any) {
    console.error('Analyze Error:', error);
    return NextResponse.json(
      { message: 'Error analyzing resume', error: error.message },
      { status: 500 }
    );
  }
}
