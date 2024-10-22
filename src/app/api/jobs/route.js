import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit')) || 0;

  try {
    let query = Job.find().sort({ createdAt: -1 });
    
    if (limit > 0) {
      query = query.limit(limit);
    }

    const jobs = await query.exec();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();

  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'recruiter') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const jobData = await request.json();
    const job = new Job({
      ...jobData,
      recruiter: decoded.id,
    });

    await job.save();
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
