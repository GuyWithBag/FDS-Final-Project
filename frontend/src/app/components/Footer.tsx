import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Import social media icons

const Footer = () => (
  <footer className="bg-gray-50 text-gray-600 py-10 mt-12 border-t">
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Travel Explorer</h3>
          <p className="text-sm text-gray-600">Explore the world with us. We offer the best packages for your dream vacation.</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-gray-800 transition">Home</Link></li>
            <li><Link href="/packages" className="hover:text-gray-800 transition">Packages</Link></li>
            <li><Link href="/bookings" className="hover:text-gray-800 transition">My Bookings</Link></li>
            <li><Link href="/reviews" className="hover:text-gray-800 transition">Reviews</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Connect with Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-gray-800 transition"><FaFacebook /></a>
            <a href="#" className="hover:text-gray-800 transition"><FaTwitter /></a>
            <a href="#" className="hover:text-gray-800 transition"><FaInstagram /></a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm mt-8 border-t pt-6">
        &copy; {new Date().getFullYear()} Travel Explorer. All rights reserved.<br />
        <span className="text-xs text-gray-400">Demo project for FDS - Final Project</span>
      </div>
    </div>
  </footer>
);

export default Footer;
