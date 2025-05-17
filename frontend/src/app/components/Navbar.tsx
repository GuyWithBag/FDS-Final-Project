'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaBook, FaStar, FaPlane } from 'react-icons/fa';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) { // Adjust the scroll threshold as needed
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <nav className={`fixed w-full z-10 transition-colors duration-300 ${pathname === '/' && !isScrolled ? 'bg-transparent' : 'bg-orange-500 shadow-md'} text-white px-6 py-4`}>
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tight hover:text-orange-200 transition flex items-center">
          <FaPlane className="mr-2" />Travel Explorer
        </Link>
        <div className="space-x-6 flex">
          <Link href="/" className="hover:text-orange-200 transition flex items-center"><FaHome className="mr-1" />Home</Link>
          <Link href="/bookings" className="hover:text-orange-200 transition flex items-center"><FaBook className="mr-1" />My Bookings</Link>
          <Link href="/reviews" className="hover:text-orange-200 transition flex items-center"><FaStar className="mr-1" />Reviews</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
