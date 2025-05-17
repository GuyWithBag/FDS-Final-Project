'use client';

import React, { useEffect, useState } from 'react';
import { Booking } from '@/types/Booking'; // Import the Booking type
import BookingRow from './BookingRow'; // We will create this next

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace with actual logged-in user ID
  const userId = 1; 

  const fetchBookings = async () => {
    try {
      // Assuming your backend has an endpoint like /api/bookings?userID=...
      const res = await fetch(`http://localhost:3001/api/bookings?userID=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      // Filter bookings by user ID if backend doesn't handle it (backend should ideally filter)
      // const userBookings = data.filter((booking: Booking) => booking.userID === userId);
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userId]); // Refetch if user ID changes (in a real app)

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (bookings.length === 0) return <div>No bookings found.</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      <p className="text-sm text-gray-600 mb-4">Note: Payment status updates automatically when booking is completed (via SQL trigger).</p>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Package</th>
            <th className="py-2 px-4 border-b text-left">Booking Date</th>
            <th className="py-2 px-4 border-b text-left">Price</th>
            <th className="py-2 px-4 border-b text-left">Booking Status</th>
            <th className="py-2 px-4 border-b text-left">Payment Status</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <BookingRow key={booking.bookingID} booking={booking} onBookingUpdated={fetchBookings} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingList; 