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
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">JobPortal</Link>
        <div className="space-x-4">
          <Link href="/jobs" className="hover:underline">Jobs</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">Login</Link>
              <Link href="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
