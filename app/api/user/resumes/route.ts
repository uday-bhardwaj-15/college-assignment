import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-utils';
import dbConnect from '@/lib/db';
import Resume from '@/models/Resume';
import AnalysisResult from '@/models/AnalysisResult';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticate(req);
    
    if (authResult.error || !authResult.user) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    await dbConnect();

    // Fetch all resumes for the current logged-in user
    const resumes = await Resume.find({ userId: authResult.user._id }).sort({ createdAt: -1 });

    // For each resume, see if an AnalysisResult exists to decorate the response with the ATS Score
    const enhancedResumes = await Promise.all(
      resumes.map(async (resume) => {
        const analysis = await AnalysisResult.findOne({ resumeId: resume._id }).select('atsScore');
        
        return {
          id: resume._id.toString(),
          fileName: resume.fileName,
          uploadedAt: resume.createdAt,
          atsScore: analysis ? analysis.atsScore : null,
          status: analysis ? 'analyzed' : 'pending', // Mimic mock-data statuses
        };
      })
    );

    return NextResponse.json(enhancedResumes, { status: 200 });

  } catch (error: any) {
    console.error('User Resumes Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch resume history', error: error.message },
      { status: 500 }
    );
  }
}
