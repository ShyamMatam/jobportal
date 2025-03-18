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
      className="max-w-6xl mx-auto px-4 py-12 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 min-h-screen"
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 sm:mb-12 text-center relative"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 inline-block">
          Exciting Job
        </span>
        <br className="sm:hidden" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 inline-block">
          Opportunities
        </span>
        <motion.div
          className="absolute -z-10 w-full h-full top-0 left-0 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 blur-xl opacity-50"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.h1>

      {jobs.length > 0 ? (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {jobs.map((job, index) => (
            <motion.li
              key={job._id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="bg-white/90 backdrop-blur-md rounded-xl overflow-hidden border-2 border-transparent hover:border-indigo-200 transition-all duration-300"
            >
              <div className="p-6 flex flex-col space-y-4 relative overflow-hidden">
                <motion.div
                  className="absolute -z-10 top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 opacity-50"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />

                <h2 className="text-3xl font-extrabold mb-4 relative group">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 transition-all duration-300">
                    {job.title || 'Position Title Missing'}
                  </span>
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                  />
                </h2>

                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image
                        src={job.companyLogo || '/default-company-logo.png'}
                        alt={job.company}
                        width={60}
                        height={60}
                        className="rounded-full ring-2 ring-indigo-300 p-1 bg-white"
                        unoptimized={job.companyLogo?.startsWith('http')}
                      />
                    </motion.div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-x-2">
                      <p className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        {job.company}
                      </p>
                      <span className="inline-flex items-center rounded-full bg-gradient-to-r from-green-400 to-emerald-500 px-3 py-1 text-xs font-medium text-white">
                        {job.type}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 space-x-2">
                      <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm leading-5 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 font-medium">
                        {job.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1.5 rounded-full">
                    <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                    </svg>
                    <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                      {job.employmentType}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 rounded-full">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                      {job.jobType}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-1.5 rounded-full">
                    <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                      {job.experienceLevel}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-50 to-rose-50 px-3 py-1.5 rounded-full">
                    <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8v2h1v-2h-1zm-2-6H7v4h6V7zm2 0h1v4h-1V7zm1 6h-1v4h1v-4zM9 17v-2H7v2h2z" />
                    </svg>
                    <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600">
                      {job.workplaceType}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">
                    ₹{job.salary}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block"
                    >
                      {user ? (
                        <Link href={`/jobs/${job._id}/apply`}
                          className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-2 rounded-full hover:from-green-500 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg inline-block">
                          Apply
                        </Link>
                      ) : (
                        <Link href="/login"
                          className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-2 rounded-full hover:from-green-500 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg inline-block"
                          onClick={(e) => {
                            e.preventDefault();
                            const confirmed = window.confirm('Please log in to apply for this job. Would you like to log in now?');
                            if (confirmed) {
                              window.location.href = '/login';
                            }
                          }}>
                          Apply
                        </Link>
                      )}
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block"
                    >
                      <Link href={`/jobs/${job._id}`}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg inline-block">
                        View details
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center p-12"
        >
          <p className="text-2xl font-bold text-gray-600 bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-md border border-indigo-100">
            No jobs available at the moment. Check back soon!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
