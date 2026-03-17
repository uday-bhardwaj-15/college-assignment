import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-utils';
import Groq from 'groq-sdk';
import dbConnect from '@/lib/db';
import Resume from '@/models/Resume';

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

    const resume = await Resume.findOne({ _id: resumeId, userId: authResult.user._id });
    
    if (!resume) {
      return NextResponse.json({ message: 'Resume not found or unauthorized' }, { status: 404 });
    }
    
    const resumeText = resume.parsedText;

    const systemPrompt = `Analyze the provided resume text and generate highly relevant job keywords and target roles based STRICTLY on the user's existing experience and skills. Do not hallucinate roles or keywords that require technologies the user does not possess.

Return the result STRICTLY as a JSON object matching this schema exactly, with no additional text or formatting:
{
  "roles": ["Role 1", "Role 2", "Role 3"],
  "keywords": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"]
}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: resumeText }
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const aiResponseContent = chatCompletion.choices[0]?.message?.content || '{}';
    let result;
    try {
      result = JSON.parse(aiResponseContent);
    } catch (e) {
      console.error('Failed parsing job keywords from JSON', aiResponseContent);
      return NextResponse.json({ message: 'Error formatting AI response' }, { status: 500 });
    }

    return NextResponse.json({
      roles: result.roles || [],
      keywords: result.keywords || []
    }, { status: 200 });

  } catch (error: any) {
    console.error('Job Keywords Error:', error);
    return NextResponse.json(
      { message: 'Error generating keywords', error: error.message },
      { status: 500 }
    );
  }
}
