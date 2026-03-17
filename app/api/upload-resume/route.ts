import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { authenticate } from '@/lib/auth-utils';
import dbConnect from '@/lib/db';
import Resume from '@/models/Resume';
import '@/lib/polyfills';
const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticate(req);
    
    if (authResult.error || !authResult.user) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Validate size (e.g., 5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Invalid file type. Only PDF and DOCX are supported.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save locally
    const uploadDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir);
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Parse Text
    let parsedText = '';
    try {
      if (file.type === 'application/pdf') {
        const pdfData = await pdfParse(buffer);
        parsedText = pdfData.text;
      } else {
        const result = await mammoth.extractRawText({ buffer });
        parsedText = result.value;
      }
    } catch (parseError) {
      console.error('Error parsing file:', parseError);
      return NextResponse.json(
        { message: 'Failed to extract text from the file.' },
        { status: 500 }
      );
    }

    await dbConnect();
    
    const resume = await Resume.create({
      userId: authResult.user._id,
      fileName: file.name,
      fileUrl: `/uploads/${filename}`, // Publicly accessible path not strictly implemented, but saved for reference
      type: file.type,
      parsedText,
    });

    console.log(`[Upload API] Successfully uploaded and parsed resume ${resume._id} for user ${authResult.user._id}`);

    return NextResponse.json({
      resumeId: resume._id,
      fileName: resume.fileName,
      uploadedAt: resume.createdAt,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { message: 'Error uploading file', error: error.message },
      { status: 500 }
    );
  }
}
