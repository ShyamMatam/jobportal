'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import JobSeekerDashboard from '@/components/JobSeekerDashboard';
import RecruiterDashboard from '@/components/RecruiterDashboard';
import ResumeUpload from '@/components/ResumeUpload';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user', {
          credentials: 'include'
        });
        if (res.ok) {
          const userData = await res.json();
          console.log('User data:', userData);
          setUser(userData);
        } else {
          const errorData = await res.json();
          console.error('Error response:', errorData);
          throw new Error(errorData.error || 'Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-6 py-12 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen"
    >
      <header className="flex justify-between items-center mb-12 bg-white p-6 rounded-xl shadow-lg">
        <motion.h1
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-extrabold text-indigo-700"
        >
          Welcome, {user.name}
        </motion.h1>
        <nav className="space-x-6">
          <NavLink href="/profile">
            <FaUser className="inline-block mr-2" />
            Profile
          </NavLink>
          <LogoutButton router={router} />
        </nav>
      </header>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-8 rounded-xl shadow-lg"
      >
        {user.role === 'user' ? (
          <JobSeekerDashboard user={user} />
        ) : (
          <RecruiterDashboard user={user} />
        )}
      </motion.div>
    </motion.div>
  );
}

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

const ErrorMessage = ({ error }) => (
  <div className="flex flex-col items-center justify-center h-screen bg-red-50">
    <h2 className="text-2xl font-bold text-red-600 mb-4">Error: {error}</h2>
    <Link href="/login" className="text-indigo-600 hover:underline">
      Please login to continue
    </Link>
  </div>
);

const NavLink = ({ href, children }) => (
  <Link
    href={href}
    className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200 flex items-center"
  >
    {children}
  </Link>
);

const LogoutButton = ({ router }) => (
  <button
    onClick={async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    }}
    className="text-red-500 hover:text-red-700 transition-colors duration-200 flex items-center"
  >
    <FaSignOutAlt className="inline-block mr-2" />
    Logout
  </button>
);
