import React from 'react';

const Footer = () => (
  <footer className="bg-gray-100 text-gray-600 py-4 mt-8 border-t">
    <div className="max-w-6xl mx-auto text-center text-sm">
      &copy; {new Date().getFullYear()} Travel Explorer. All rights reserved.<br />
      <span className="text-xs text-gray-400">Demo project for FDS - Final Project</span>
    </div>
  </footer>
);

export default Footer;
