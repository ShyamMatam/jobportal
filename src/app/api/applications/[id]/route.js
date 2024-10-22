import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Application from '@/models/Application';
import { verifyToken } from '@/lib/auth';

export async function PATCH(request, { params }) {
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

    const { status } = await request.json();

    const application = await Application.findByIdAndUpdate(
      params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}




