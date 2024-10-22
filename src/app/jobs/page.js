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
      className="max-w-6xl mx-auto px-4 py-12 bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="text-4xl font-bold mb-12 text-center text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
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
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl"
            >
              <div className="p-6 flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Image src={job.companyLogo || '/default-company-logo.png'} alt={job.company} width={60} height={60} className="rounded-full" />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-2xl font-semibold text-blue-600">{job.title}</h2>
                    <p className="text-gray-600 font-medium">{job.company} - {job.location}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {job.employmentType} • {job.experienceLevel} • ₹{job.salary}
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-600">{job.workplaceType} • {job.jobType}</span>
                  <div className="space-x-2">
                    {user && user.role === 'user' && (
                      <Link href={`/jobs/${job._id}/apply`} className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-300">
                        Apply
                      </Link>
                    )}
                    <Link href={`/jobs/${job._id}`} className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300">
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
          className="text-center text-gray-600 text-xl bg-white p-8 rounded-lg shadow-md"
        >
          No jobs available at the moment. Check back soon!
        </motion.p>
      )}
    </motion.div>
  );
}
