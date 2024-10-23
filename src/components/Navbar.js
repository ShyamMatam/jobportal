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
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tight hover:text-blue-200 transition duration-300">
            JobPortal
          </Link>
          <div className="space-x-6 text-sm font-medium">
            <Link href="/jobs" className="hover:text-blue-200 transition duration-300">Jobs</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="hover:text-blue-200 transition duration-300">Dashboard</Link>
                <button 
                  onClick={handleLogout} 
                  className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-full transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-200 transition duration-300">Login</Link>
                <Link 
                  href="/register" 
                  className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-full transition duration-300"
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
