import React from 'react';
import Link from 'next/link';

const Navbar = () => (
  <nav className="bg-blue-700 text-white px-6 py-4 shadow-md">
    <div className="max-w-6xl mx-auto flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold tracking-tight hover:text-blue-200 transition">Travel Explorer</Link>
      <div className="space-x-6">
        <Link href="/" className="hover:text-blue-200 transition">Home</Link>
        <Link href="/bookings" className="hover:text-blue-200 transition">My Bookings</Link>
        <Link href="/reviews" className="hover:text-blue-200 transition">Reviews</Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
