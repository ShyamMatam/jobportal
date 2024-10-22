import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const job = await Job.findById(params.id).select('-recruiter');
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Keep the PUT method as it was before, requiring authentication