'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function JobDetail({ params }) {
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, userRes] = await Promise.all([
          fetch(`/api/jobs/${params.id}`),
          fetch('/api/user', { credentials: 'include' })
        ]);

        if (jobRes.ok) {
          const jobData = await jobRes.json();
          setJob(jobData);
        } else {
          throw new Error('Failed to fetch job details');
        }

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load job details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleApply = () => {
    if (user) {
      router.push(`/jobs/${params.id}/apply`);
    } else {
      router.push(`/login?redirect=/jobs/${params.id}/apply`);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!job) return <NotFound message="Job not found" />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="max-w-3xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden"
      >
        <div className="px-6 py-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl font-extrabold mb-6 text-gray-800 border-b pb-4"
          >
            {job.title}
          </motion.h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <JobDetailItem icon="🏢" label="Company" value={job.company} />
            <JobDetailItem icon="📍" label="Location" value={job.location} />
            <JobDetailItem icon="💰" label="Salary" value={job.salary} />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Description</h2>
            <p className="text-gray-600 leading-relaxed">{job.description}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <button 
              onClick={handleApply}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-lg font-semibold shadow-lg transform hover:scale-105"
            >
              {user ? 'Apply for this job' : 'Login to Apply'}
            </button>
            {!user && (
              <p className="mt-6 text-sm text-gray-600">
                Don't have an account? <Link href="/register" className="text-blue-500 hover:text-blue-700 transition-colors duration-300 font-medium">Register here</Link>
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const JobDetailItem = ({ icon, label, value }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="flex items-center space-x-2"
  >
    <span className="text-2xl">{icon}</span>
    <div>
      <span className="font-semibold text-gray-700">{label}:</span>
      <span className="text-gray-600 ml-1">{value}</span>
    </div>
  </motion.div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
    />
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-lg shadow-lg text-center"
    >
      <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
      <p className="text-gray-600">{message}</p>
    </motion.div>
  </div>
);

const NotFound = ({ message }) => (
  <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-lg shadow-lg text-center"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Not Found</h2>
      <p className="text-gray-600">{message}</p>
    </motion.div>
  </div>
);
