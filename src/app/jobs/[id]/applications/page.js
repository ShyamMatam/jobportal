'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function JobApplications({ params }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(`/api/jobs/${params.id}/applications`, {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setApplications(data);
        } else {
          throw new Error('Failed to fetch applications');
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [params.id]);

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      // Optimistically update the UI
      setApplications(apps => apps.map(app => 
        app._id === applicationId ? {...app, status: newStatus} : app
      ));

      const res = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      // If the request was successful, we don't need to do anything else
      // because we've already updated the UI
    } catch (error) {
      console.error('Error updating application status:', error);
      setError('Failed to update application status. Please try again.');
      // Revert the optimistic update
      setApplications(apps => apps.map(app => 
        app._id === applicationId ? {...app, status: app.status} : app
      ));
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <motion.div
        className="w-16 h-16 border-t-4 border-blue-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      ></motion.div>
    </div>
  );
  
  if (error) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-screen bg-red-100 text-red-600 font-semibold"
    >
      {error}
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-8 bg-gradient-to-r from-blue-100 to-purple-100"
    >
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center text-gray-800"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        Job Applications
      </motion.h1>
      
      <AnimatePresence>
        {applications.length === 0 ? (
          <motion.p 
            key="no-applications"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-600 text-lg"
          >
            No applications yet for this job.
          </motion.p>
        ) : (
          <motion.ul 
            className="space-y-6 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {applications.map((application) => (
              <motion.li 
                key={application._id} 
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{application.applicant.name}</h2>
                <p className="text-gray-600 mb-3">{application.applicant.email}</p>
                <p className="mt-3 text-gray-700 bg-gray-50 p-4 rounded-lg">{application.coverLetter}</p>
                <p className="mt-4 text-sm text-gray-500">
                  Applied on: {new Date(application.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-4 flex items-center">
                  <label htmlFor={`status-${application._id}`} className="mr-3 text-gray-700 font-medium">Status:</label>
                  <motion.select 
                    id={`status-${application._id}`}
                    value={application.status} 
                    onChange={(e) => updateApplicationStatus(application._id, e.target.value)}
                    className="border rounded-full px-4 py-2 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </motion.select>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
