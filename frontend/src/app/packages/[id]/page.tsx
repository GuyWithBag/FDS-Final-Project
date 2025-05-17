'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BookingForm from '@/app/components/BookingForm';
import { TourPackage } from '@/types/TourPackage';

export default function PackageDetailsPage() {
  const params = useParams();
  const packageId = params.id;

  const [packageDetails, setPackageDetails] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!packageId) return;

    const fetchPackageDetails = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/tour-packages/${packageId}`);
        if (!res.ok) throw new Error('Failed to fetch package details');
        const data = await res.json();
        setPackageDetails(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [packageId]);

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-8">Loading package details...</div>;
  if (error) return <div className="max-w-6xl mx-auto px-4 py-8 text-red-500">Error: {error}</div>;
  if (!packageDetails) return <div className="max-w-6xl mx-auto px-4 py-8">Package not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-4 text-white">{packageDetails.PackageName}</h1>
      {/* Add more package details here */}
      <p className="text-gray-700 mb-4">{packageDetails.Description}</p>
      <div className="text-lg font-semibold text-orange-600 mb-4">
        Price: ${Number(packageDetails.BasePrice).toFixed(2)}
      </div>
      <div className="text-gray-600 mb-6">
        Duration: {packageDetails.DurationDays} days
      </div>

      {/* Add BookingForm */}
      <BookingForm packageId={packageDetails.packageID} />

    </div>
  );
}
