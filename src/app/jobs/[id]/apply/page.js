'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ApplyJob({ params }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/jobs/${params.id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coverLetter }),
        credentials: 'include',
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to apply for the job');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-white to-blue-50 shadow-xl rounded-lg border border-blue-100"
    >
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center text-blue-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Apply for Job
      </motion.h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <label htmlFor="coverLetter" className="block mb-3 text-xl font-medium text-gray-700">Cover Letter</label>
          <textarea
            id="coverLetter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            required
            className="w-full px-5 py-4 border-2 border-blue-200 rounded-lg focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 resize-none"
            rows="10"
            placeholder="Tell us why you're the perfect fit for this position..."
          ></textarea>
        </motion.div>
        {error && (
          <motion.p 
            className="text-red-500 text-center font-semibold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {error}
          </motion.p>
        )}
        <motion.button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 shadow-md"
          disabled={isSubmitting}
          whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              Submitting...
            </motion.span>
          ) : (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              Submit Application
            </motion.span>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
