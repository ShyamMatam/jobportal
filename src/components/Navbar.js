'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl sm:text-3xl font-bold tracking-tighter hover:scale-105 transform transition-all duration-300 ease-in-out bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text"
          >
            JobPortal
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 text-base font-medium">
            <Link
              href="/jobs"
              className="relative group hover:text-white transition-colors duration-300 self-center"
            >
              Jobs
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="relative group hover:text-white transition-colors duration-300 self-center"
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
                  className="relative group hover:text-white transition-colors duration-300 self-center"
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

        {/* Mobile Navigation */}
        <div className={`
          lg:hidden 
          ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'} 
          overflow-hidden transition-all duration-300 ease-in-out
        `}>
          <div className="pt-4 pb-3 space-y-3">
            <Link
              href="/jobs"
              className="block px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
            >
              Jobs
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md bg-white text-purple-600 font-semibold
                    hover:bg-opacity-90 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md bg-white text-purple-600 font-semibold
                    hover:bg-opacity-90 transition-colors"
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
