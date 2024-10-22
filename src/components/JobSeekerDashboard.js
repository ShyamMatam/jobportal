import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function JobSeekerDashboard({ user }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const jobsData = await res.json();
          setJobs(jobsData);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs available at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job._id} className="border p-4 rounded">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p>{job.company}</p>
              <p>{job.location}</p>
              <Link href={`/jobs/${job._id}`} className="text-blue-500 hover:underline">
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
