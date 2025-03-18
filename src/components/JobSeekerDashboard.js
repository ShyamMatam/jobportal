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
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-transparent bg-clip-text">
        Available Jobs
      </h2>

      {jobs.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-6 sm:p-8 text-center">
          <p className="text-gray-600 text-base sm:text-lg">No jobs available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl p-4 sm:p-6 
                transform hover:-translate-y-2 transition-all duration-300 ease-in-out
                border border-gray-100 hover:border-purple-200"
            >
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 group-hover:text-purple-600 
                  transition-colors duration-300 line-clamp-2">
                  {job.title}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600 text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="line-clamp-1">{job.company}</p>
                  </div>

                  <div className="flex items-center text-gray-600 text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="line-clamp-1">{job.location}</p>
                  </div>
                </div>

                <Link
                  href={`/jobs/${job._id}`}
                  className="inline-block w-full sm:w-auto text-center mt-4 px-6 py-2.5 bg-gradient-to-r 
                    from-indigo-600 via-purple-600 to-pink-500 text-white rounded-full 
                    text-sm sm:text-base font-medium hover:shadow-lg transform 
                    hover:-translate-y-0.5 transition-all duration-300 ease-in-out 
                    active:scale-95"
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
