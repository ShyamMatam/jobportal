import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';
import Application from '@/models/Application';
import { verifyToken } from '@/lib/auth';

export async function POST(request, { params }) {
  await dbConnect();

  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'user') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const { coverLetter } = await request.json();

    if (!coverLetter) {
      return NextResponse.json({ error: 'Cover letter is required' }, { status: 400 });
    }

    const job = await Job.findById(params.id);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const existingApplication = await Application.findOne({
      job: params.id,
      applicant: decoded.id
    });

    if (existingApplication) {
      return NextResponse.json({ error: 'You have already applied for this job' }, { status: 400 });
    }

    const application = new Application({
      job: params.id,
      applicant: decoded.id,
      coverLetter,
      status: 'pending'
    });

    await application.save();

    return NextResponse.json({ message: 'Application submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error applying for job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

