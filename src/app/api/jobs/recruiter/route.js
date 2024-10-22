import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  await dbConnect();

  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);
    const jobs = await Job.find({ recruiter: decoded.id }).sort({ createdAt: -1 });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching recruiter jobs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
  
}