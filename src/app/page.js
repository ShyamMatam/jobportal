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
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4 py-8"
    >
      <motion.h1
        initial={{ scale: 0.9, rotateX: -90 }}
        animate={{ scale: 1, rotateX: 0 }}
        transition={{ type: 'spring', stiffness: 200, duration: 1 }}
        className="text-6xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text drop-shadow-lg"
      >
        Welcome to Job Portal
      </motion.h1>

      {user ? (
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ delay: 0.2 }}
          className="mb-12 flex justify-between items-center bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20"
        >
          <div>
            <p className="text-2xl mb-4">Welcome back, <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">{user.name}</span>!</p>
            <Link href="/dashboard" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full hover:from-blue-600 hover:to-purple-600 transition duration-300 shadow-lg hover:shadow-xl">
              Go to Dashboard
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-full hover:from-red-600 hover:to-pink-600 transition duration-300 shadow-lg hover:shadow-xl"
          >
            Logout
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 flex justify-center space-x-8"
        >
          <Link href="/register" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-10 py-4 rounded-full hover:from-blue-600 hover:to-purple-600 transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Register
          </Link>
          <Link href="/login" className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-10 py-4 rounded-full hover:from-green-600 hover:to-teal-600 transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Login
          </Link>
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"
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
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
              transition={{ delay: 0.2 * index }}
              className="border border-white/20 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 bg-white/80 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">{job.title}</h3>
              <p className="mb-3 text-gray-700">{job.company} - {job.location}</p>
              <Link href={`/jobs/${job._id}`} className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition duration-300 shadow-md hover:shadow-lg">
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
        <Link href="/jobs" className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-8 py-3 rounded-full hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          View All Job Listings
        </Link>
      </motion.div>
    </motion.div>
  );
}
