import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Application from '@/models/Application';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
  await dbConnect();

  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);
    const { jobId } = await request.json();

    const application = new Application({
      job: jobId,
      applicant: decoded.id,
    });

    await application.save();
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
