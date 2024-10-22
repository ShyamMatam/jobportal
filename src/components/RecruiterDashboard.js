import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RecruiterDashboard({ user }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs/recruiter');
        if (res.ok) {
          const jobsData = await res.json();
          setJobs(jobsData);
        }
      } catch (error) {
        console.error('Error fetching recruiter jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div>Loading your job postings...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recruiter Dashboard</h2>
      {/* <Link href="/jobs/create" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Post a New Job
      </Link> */}
      <div className="mb-4">
        <Link href="/jobs/create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create New Job Posting
        </Link>
      </div>
      <h2 className="text-xl font-semibold mb-4">Your Job Postings</h2>
      {jobs.length === 0 ? (
        <p>You haven't posted any jobs yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job._id} className="border p-4 rounded">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p>{job.company}</p>
              <p>{job.location}</p>
              <Link href={`/jobs/${job._id}/edit`} className="text-blue-500 hover:underline mr-4">
                Edit
              </Link>
              <Link href={`/jobs/${job._id}/applications`} className="text-green-500 hover:underline">
                View Applications
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

