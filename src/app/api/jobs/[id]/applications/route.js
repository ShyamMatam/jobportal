import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Application from '@/models/Application';
import { verifyToken } from '@/lib/auth';

export async function GET(request, { params }) {
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

    const applications = await Application.find({ job: params.id })
      .populate('applicant', 'name email')
      .select('applicant coverLetter status createdAt');

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}