'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, jobsRes] = await Promise.all([
          fetch('/api/user'),
          fetch('/api/jobs?limit=5')
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }

        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setJobs(jobsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        router.push('/');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen"
      >
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <motion.h1
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="text-5xl font-bold mb-12 text-center text-blue-600"
      >
        Welcome to Job Portal
      </motion.h1>
      
      {user ? (
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 flex justify-between items-center bg-white shadow-lg rounded-lg p-6"
        >
          <div>
            <p className="text-2xl mb-4">Welcome back, <span className="font-semibold text-blue-600">{user.name}</span>!</p>
            <Link href="/dashboard" className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300">
              Go to Dashboard
            </Link>
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 flex justify-center space-x-6"
        >
          <Link href="/register" className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition duration-300 transform hover:scale-105">
            Register
          </Link>
          <Link href="/login" className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition duration-300 transform hover:scale-105">
            Login
          </Link>
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-semibold mb-6 text-blue-600"
      >
        Latest Job Listings
      </motion.h2>
      {jobs.length > 0 ? (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          {jobs.map((job, index) => (
            <motion.li
              key={job._id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 * index }}
              className="border p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <h3 className="text-2xl font-semibold text-blue-600">{job.title}</h3>
              <p className="mb-3 text-gray-600">{job.company} - {job.location}</p>
              <Link href={`/jobs/${job._id}`} className="text-blue-500 hover:underline">
                View Details
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-600"
        >
          No jobs available at the moment.
        </motion.p>
      )}

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-center"
      >
        <Link href="/jobs" className="text-blue-500 hover:underline text-lg">
          View All Job Listings
        </Link>
      </motion.div>
    </motion.div>
  );
}
