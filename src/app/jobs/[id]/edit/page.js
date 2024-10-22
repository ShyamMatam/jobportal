'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function EditJob({ params }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${params.id}`, {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setJob(data);
        } else {
          throw new Error('Failed to fetch job');
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        setError('Failed to load job. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob(prevJob => ({ ...prevJob, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`/api/jobs/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(job),
        credentials: 'include',
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update job');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      setError('An error occurred. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg"
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Job</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">Job Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={job.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <label htmlFor="company" className="block mb-2 text-sm font-medium text-gray-700">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            value={job.company}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={job.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">Job Description</label>
          <textarea
            id="description"
            name="description"
            value={job.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            rows="5"
          ></textarea>
        </motion.div>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm"
          >
            {error}
          </motion.p>
        )}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
        >
          Update Job
        </motion.button>
      </form>
    </motion.div>
  );
}
