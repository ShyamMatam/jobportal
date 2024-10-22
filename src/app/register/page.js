'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        const error = await res.json();
        setError(error.error);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl"
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'email', 'password'].map((field) => (
          <motion.div
            key={field}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: ['name', 'email', 'password'].indexOf(field) * 0.1 }}
          >
            <label htmlFor={field} className="block mb-1 text-sm font-medium text-gray-700 capitalize">
              {field}
            </label>
            <input
              type={field === 'password' ? 'password' : 'text'}
              id={field}
              value={eval(field)}
              onChange={(e) => eval(`set${field.charAt(0).toUpperCase() + field.slice(1)}`)(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label htmlFor="role" className="block mb-1 text-sm font-medium text-gray-700">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="user">Job Seeker</option>
            <option value="recruiter">Recruiter</option>
          </select>
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
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Register
        </motion.button>
      </form>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center text-sm text-gray-600"
      >
        Already have an account?{' '}
        <Link href="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </motion.p>
    </motion.div>
  );
}
