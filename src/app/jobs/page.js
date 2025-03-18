'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, userRes] = await Promise.all([
          fetch('/api/jobs'),
          fetch('/api/user', { credentials: 'include' })
        ]);

        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setJobs(jobsData);
        }

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <motion.div
        className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 py-12 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100"
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
      >
        Exciting Job Opportunities
      </motion.h1>
      {jobs.length > 0 ? (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {jobs.map((job) => (
            <motion.li
              key={job._id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl border border-indigo-100"
            >
              <div className="p-6 flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={job.companyLogo || '/default-company-logo.png'}
                      alt={job.company}
                      width={60}
                      height={60}
                      className="rounded-full ring-2 ring-indigo-300 p-1"
                      unoptimized={job.companyLogo?.startsWith('http')}
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-x-2">
                      <h3 className="text-sm font-semibold leading-6 text-gray-900">
                        {job.position}
                      </h3>
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {job.type}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-5 text-gray-500">
                      {job.company} • {job.location}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {job.employmentType} • {job.experienceLevel} • ₹{job.salary}
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-600">{job.workplaceType} • {job.jobType}</span>
                  <div className="space-x-2">
                    {user && user.role === 'user' && (
                      <Link href={`/jobs/${job._id}/apply`}
                        className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-2 rounded-full hover:from-green-500 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg">
                        Apply
                      </Link>
                    )}
                    <Link href={`/jobs/${job._id}`}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg">
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-600 text-xl bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-md border border-indigo-100"
        >
          No jobs available at the moment. Check back soon!
        </motion.p>
      )}
    </motion.div>
  );
}
