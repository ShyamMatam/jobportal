import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
  console.log('Received resume upload request');
  await dbConnect();

  const token = request.cookies.get('token')?.value;

  if (!token) {
    console.log('No authentication token found');
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      console.log('Invalid token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    console.log('User authenticated:', decoded.id);

    const formData = await request.formData();
    console.log('FormData received:', formData);

    const file = formData.get('resume');  // Change 'file' to 'resume'
    console.log('File details:', file ? { name: file.name, type: file.type, size: file.size } : 'No file found');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    console.log('Upload directory:', uploadDir);

    const uniqueFilename = `${decoded.id}-${Date.now()}${path.extname(file.name)}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    console.log('File will be saved as:', filePath);

    await writeFile(filePath, buffer);
    console.log('File written successfully');

    const resumeUrl = `/uploads/${uniqueFilename}`;
    await User.findByIdAndUpdate(decoded.id, { resume: resumeUrl });
    console.log('User database updated');

    return NextResponse.json({ message: 'Resume uploaded successfully', resumeUrl });
  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}