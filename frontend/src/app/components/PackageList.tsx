'use client'

import React, { useEffect, useState } from 'react';
import PackageCard from './PackageCard';
import { TourPackage } from '@/types/TourPackage';

const PackageList: React.FC = () => {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/tour-packages');
        if (!res.ok) throw new Error('Failed to fetch packages');
        const data = await res.json();
        setPackages(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (loading) return <div>Loading packages...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {packages.map(pkg => (
        <PackageCard key={pkg.packageID} {...pkg} />
      ))}
    </div>
  );
};

export default PackageList;
