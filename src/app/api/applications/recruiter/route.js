export async function GET(req) {
    // ... authentication and authorization checks ...
  
    const applications = await Application.find({ recruiterId: recruiterId })
      .select('jobTitle applicantName applicantEmail resumeUrl')
      .lean();
  
    return new Response(JSON.stringify(applications), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  