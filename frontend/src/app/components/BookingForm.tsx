'use client';

import React, { useState } from 'react';

interface BookingFormProps {
  packageId: number;
  // You might need to pass initial data or handle success/error messages
  // onBookingSuccess: (bookingDetails: any) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ packageId /*, onBookingSuccess*/ }) => {
  const [bookingDate, setBookingDate] = useState('');
  const [numPeople, setNumPeople] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!bookingDate || numPeople <= 0) {
      setError('Please select a date and number of people.');
      setLoading(false);
      return;
    }

    // Assuming you have a way to get the logged-in user ID (replace with actual logic)
    const userId = 1; // TODO: Replace with dynamic user ID

    // You might need to calculate BookingPrice here or in the backend
    // For simplicity, sending a placeholder price; backend should calculate based on package/season
    const dummyBookingPrice = 100; // TODO: Calculate actual price

    try {
      const res = await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: userId,
          packageID: packageId,
          BookingDate: bookingDate, // Ensure format matches backend expectation (YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)
          BookingPrice: dummyBookingPrice, // TODO: Use calculated price
          BookingStatus: 'Pending', // Default status
          // You might need to include other booking details depending on your schema (hotel, transport, activities)
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const data = await res.json();
      setSuccess('Booking created successfully!');
      // onBookingSuccess(data);
      // Optionally reset form or redirect
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-8">
      <h3 className="text-xl font-bold mb-4">Book this Package</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700">Booking Date</label>
          <input
            type="date"
            id="bookingDate"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="numPeople" className="block text-sm font-medium text-gray-700">Number of People</label>
          <input
            type="number"
            id="numPeople"
            value={numPeople}
            onChange={(e) => setNumPeople(parseInt(e.target.value))}
            required
            min="1"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">{success}</div>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
