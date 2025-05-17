import React from 'react';
import PackageList from './components/PackageList';

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Travel & Tour Packages</h1>
      <p className="mb-8 text-center text-gray-600">Explore our exciting vacation packages and book your next adventure!</p>
      <PackageList />
    </main>
  );
}