'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ResumeUpload from './resume-upload';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user');
        if (!res.ok) throw new Error('Failed to fetch user data');
        const data = await res.json();
        setUser(data);
        setName(data.name);
        setEmail(data.email);
        setResumeUrl(data.resume);
        setLoading(false);
      } catch (err) {
        setError('Error fetching user data. Please try again.');
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateMessage('');
    setError('');

    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) throw new Error('Failed to update profile');
      
      setUpdateMessage('Profile updated successfully');
    } catch (err) {
      setError('Error updating profile. Please try again.');
    }
  };

  const handleResumeUpload = (url) => {
    setResumeUrl(url);
    setUpdateMessage('Resume uploaded successfully');
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  if (loading) return <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center text-2xl mt-10">Loading...</motion.div>;
  if (error) return <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center text-red-500 text-2xl mt-10">{error}</motion.div>;
  if (!user) return <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center text-2xl mt-10">No user data available</motion.div>;

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={fadeIn} 
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">User Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>
        {updateMessage && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-green-500"
          >
            {updateMessage}
          </motion.p>
        )}
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-red-500"
          >
            {error}
          </motion.p>
        )}
        <motion.button 
          type="submit" 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Update Profile
        </motion.button>
      </form>
      {user.role === 'user' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Resume</h2>
          {resumeUrl ? (
            <div>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                View Current Resume
              </a>
              <p className="mt-2 text-gray-600">Upload a new resume to replace the current one:</p>
            </div>
          ) : (
            <p className="text-gray-600">No resume uploaded yet. Upload your resume:</p>
          )}
          <ResumeUpload onUploadSuccess={handleResumeUpload} />
        </motion.div>
      )}
      <motion.button
        onClick={() => router.push('/dashboard')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition duration-300"
      >
        Back to Dashboard
      </motion.button>
    </motion.div>
  );
}
