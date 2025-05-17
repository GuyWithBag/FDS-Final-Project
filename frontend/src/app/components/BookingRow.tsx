'use client';

import React, { useState, useEffect } from 'react';
import { Booking } from '@/types/Booking'; // Import the Booking type
// We might need Payment type later if we fetch full payment details
// import { Payment } from '@/types/Payment'; 

interface BookingRowProps {
  booking: Booking;
  onBookingUpdated: () => void; // Callback to refresh the list
}

const BookingRow: React.FC<BookingRowProps> = ({ booking, onBookingUpdated }) => {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(true);
  const [errorPayment, setErrorPayment] = useState<string | null>(null);

  // Fetch payment status for this booking
  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        // Assuming backend endpoint to get payment for a booking
        // Need to confirm the exact endpoint structure in backend/routes/payments.js
        const res = await fetch(`http://localhost:3001/api/payments?bookingID=${booking.bookingID}`);
        
        if (!res.ok) {
            // If no payment found, it might return 404 or empty array
            // Handle this case gracefully
            if (res.status === 404) {
                setPaymentStatus('No Payment Found');
                return;
            }
            throw new Error('Failed to fetch payment details');
        }

        const data = await res.json();
        // Assuming the response is an array of payments for the booking, take the first one
        if (data && data.length > 0) {
            setPaymentStatus(data[0].paymentStatus);
        } else {
             setPaymentStatus('No Payment Found');
        }

      } catch (err: any) {
        setErrorPayment(err.message || 'Unknown error');
        setPaymentStatus('Error fetching payment');
      } finally {
        setLoadingPayment(false);
      }
    };

    fetchPaymentStatus();
  }, [booking.bookingID]); // Refetch if booking ID changes

  // TODO: Implement Update Booking logic
  const handleUpdate = async () => {
    console.log('Update booking', booking.bookingID);
    // Example: Show a modal or form to edit booking details
    // After successful update API call:
    // onBookingUpdated(); 
  };

  // TODO: Implement Delete Booking logic
  const handleDelete = async () => {
    console.log('Delete booking', booking.bookingID);
    // Example: Show a confirmation dialog
    // After successful delete API call:
    // try {
    //   const res = await fetch(`http://localhost:3001/api/bookings/${booking.bookingID}`, {
    //     method: 'DELETE',
    //   });
    //   if (!res.ok) throw new Error('Failed to delete booking');
    //   onBookingUpdated(); // Refresh list
    // } catch (err) {
    //   console.error('Delete failed:', err);
    //   // Show error to user
    // }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="py-2 px-4 border-b">{booking.PackageName || 'N/A'}</td>
      <td className="py-2 px-4 border-b">{new Date(booking.BookingDate).toLocaleDateString()}</td>
      <td className="py-2 px-4 border-b">${Number(booking.BookingPrice).toFixed(2)}</td>
      <td className="py-2 px-4 border-b">{booking.BookingStatus}</td>
      <td className="py-2 px-4 border-b">
        {loadingPayment ? 'Fetching...' : errorPayment ? 'Error' : paymentStatus}
      </td>
      <td className="py-2 px-4 border-b space-x-2">
        {/* Add conditions to hide/show buttons based on booking status if needed */}
        <button onClick={handleUpdate} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition">Edit</button>
        <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition">Cancel</button>
      </td>
    </tr>
  );
};

export default BookingRow; 