import React from 'react';
import Link from 'next/link';

interface PackageCardProps {
  packageID: number;
  PackageName: string;
  BasePrice: number;
  DurationDays: number;
  Description?: string;
}

const PackageCard: React.FC<PackageCardProps> = ({ packageID, PackageName, BasePrice, DurationDays, Description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between h-full">
      <h2 className="text-xl font-bold mb-2 text-black">{PackageName}</h2>
      <p className="text-black mb-2">{Description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-lg font-semibold text-blue-600">${Number(BasePrice).toFixed(2)}</span>
        <span className="text-sm text-black">{DurationDays} days</span>
      </div>
      <Link href={`/packages/${packageID}`} className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">View Details</Link>
    </div>
  );
};

export default PackageCard;
