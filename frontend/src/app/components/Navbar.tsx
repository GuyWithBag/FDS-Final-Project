import React from 'react';
import Link from 'next/link';
import { FaHome, FaBook, FaStar, FaPlane } from 'react-icons/fa';

const Navbar = () => (
  <nav className="bg-blue-700 text-white px-6 py-4 shadow-md">
    <div className="max-w-6xl mx-auto flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold tracking-tight hover:text-blue-200 transition flex items-center">
        <FaPlane className="mr-2" />Travel Explorer
      </Link>
      <div className="space-x-6 flex">
        <Link href="/" className="hover:text-blue-200 transition flex items-center"><FaHome className="mr-1" />Home</Link>
        <Link href="/bookings" className="hover:text-blue-200 transition flex items-center"><FaBook className="mr-1" />My Bookings</Link>
        <Link href="/reviews" className="hover:text-blue-200 transition flex items-center"><FaStar className="mr-1" />Reviews</Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
