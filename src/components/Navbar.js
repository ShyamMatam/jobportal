'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user', { credentials: 'include' });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      if (res.ok) {
        setUser(null);
        router.push('/');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-3xl font-bold tracking-tighter hover:scale-105 transform transition-all duration-300 ease-in-out bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text"
          >
            JobPortal
          </Link>
          <div className="space-x-8 text-base font-medium">
            <Link
              href="/jobs"
              className="relative group hover:text-white transition-colors duration-300"
            >
              Jobs
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="relative group hover:text-white transition-colors duration-300"
                >
                  Dashboard
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-purple-600 px-6 py-2.5 rounded-full font-semibold
                    hover:bg-opacity-90 hover:shadow-lg transform hover:-translate-y-0.5 
                    transition-all duration-300 ease-in-out active:scale-95"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="relative group hover:text-white transition-colors duration-300"
                >
                  Login
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-purple-600 px-6 py-2.5 rounded-full font-semibold
                    hover:bg-opacity-90 hover:shadow-lg transform hover:-translate-y-0.5 
                    transition-all duration-300 ease-in-out active:scale-95"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
