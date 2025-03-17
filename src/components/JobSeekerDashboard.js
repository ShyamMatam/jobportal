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
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-transparent bg-clip-text">
        Available Jobs
      </h2>

      {jobs.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-gray-600 text-lg">No jobs available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl p-6 
                transform hover:-translate-y-2 transition-all duration-300 ease-in-out
                border border-gray-100 hover:border-purple-200"
            >
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-purple-600 
                  transition-colors duration-300">
                  {job.title}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p>{job.company}</p>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p>{job.location}</p>
                  </div>
                </div>

                <Link
                  href={`/jobs/${job._id}`}
                  className="inline-block mt-4 px-6 py-2.5 bg-gradient-to-r from-indigo-600 
                    via-purple-600 to-pink-500 text-white rounded-full font-medium
                    hover:shadow-lg transform hover:-translate-y-0.5 transition-all 
                    duration-300 ease-in-out active:scale-95"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
