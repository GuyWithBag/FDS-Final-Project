'use client';

import React, { useState, useEffect } from 'react';
import { Booking } from '@/types/Booking'; // Import the Booking type
import { FaCheck, FaTimes } from 'react-icons/fa'; // Import icons
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
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Fetch payment status for this booking
  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        // Assuming backend endpoint to get payment for a booking
        // Need to confirm the exact endpoint structure in backend/routes/payments.js
        // We expect an array of payments, even if usually just one per booking
        const res = await fetch(`http://localhost:3001/api/payments?bookingID=${booking.bookingID}`);
        
        if (!res.ok) {
            // If no payment found, it might return 404 or empty array
            // Handle this case gracefully
            if (res.status === 404 || res.status === 204) { // 204 No Content is also possible
                setPaymentStatus('No Payment Found');
                return;
            }
            throw new Error(`Failed to fetch payment details: ${res.statusText}`);
        }

        const data = await res.json();
        
        if (data && data.length > 0) {
            setPaymentStatus(data[0].paymentStatus);
        } else {
             setPaymentStatus('No Payment Found');
        }

      } catch (err: any) {
        setErrorPayment(err.message || 'Unknown error fetching payment');
        setPaymentStatus('Error fetching payment');
      } finally {
        setLoadingPayment(false);
      }
    };

    fetchPaymentStatus();
  }, [booking.bookingID]); // Refetch if booking ID changes

  // Implement Update Booking logic (e.g., changing status to Completed for trigger demo)
  const handleCompleteBooking = async () => {
    if (!confirm('Are you sure you want to mark this booking as Completed?')) {
      return;
    }
    setActionLoading(true);
    setActionError(null);
    try {
      // Assuming the backend PUT /api/bookings/:id endpoint accepts a status update
      const res = await fetch(`http://localhost:3001/api/bookings/${booking.bookingID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // Sending a simple update to status for demonstration
        // In a real app, this might involve a modal with a full form
        body: JSON.stringify({ 
            ...booking, // Send existing data
            BookingStatus: 'Completed' // Change status to Completed
            // NOTE: Your backend PUT endpoint must be able to handle updates to BookingStatus
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update booking');
      }

      // If successful, refresh the list to see the changes (including payment status from trigger)
      onBookingUpdated(); 
      setActionLoading(false);

    } catch (err: any) {
      setActionError(err.message || 'Unknown update error');
      setActionLoading(false);
    }
  };

  // Implement Delete Booking logic (Cancel Booking)
  const handleCancelBooking = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`http://localhost:3001/api/bookings/${booking.bookingID}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to cancel booking');
      }

      // If successful, refresh list
      onBookingUpdated(); 
      setActionLoading(false);

    } catch (err: any) {
      setActionError(err.message || 'Unknown cancellation error');
      setActionLoading(false);
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="py-2 px-4 border-b text-black">{booking.PackageName || 'N/A'}</td>
      <td className="py-2 px-4 border-b text-black">{new Date(booking.BookingDate).toLocaleDateString()}</td>
      <td className="py-2 px-4 border-b text-black">${Number(booking.BookingPrice).toFixed(2)}</td>
      <td className="py-2 px-4 border-b text-black">{booking.BookingStatus}</td>
      <td className="py-2 px-4 border-b text-black">
        {loadingPayment ? 'Fetching...' : errorPayment ? 'Error' : paymentStatus}
      </td>
      <td className="py-2 px-4 border-b space-x-2">
        <div className="flex space-x-2 items-center">
          {/* Add conditions to hide/show buttons based on booking status if needed */}
          <button 
            onClick={handleCompleteBooking} 
            className={`p-2 rounded-full text-sm transition disabled:opacity-50 ${
              booking.BookingStatus === 'Completed' || booking.BookingStatus === 'Cancelled' || actionLoading
                ? 'bg-gray-300 text-gray-500 pointer-events-none cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            } flex items-center justify-center`}
            disabled={actionLoading || booking.BookingStatus === 'Completed' || booking.BookingStatus === 'Cancelled'}
            title="Mark Complete"
          >
            <FaCheck />
          </button>
          <button 
            onClick={handleCancelBooking} 
            className={`p-2 rounded-full text-sm transition disabled:opacity-50 ml-2 ${
              booking.BookingStatus === 'Cancelled' || actionLoading
                ? 'bg-gray-300 text-gray-500 pointer-events-none cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
            } flex items-center justify-center`}
            disabled={actionLoading || booking.BookingStatus === 'Cancelled'}
            title="Cancel"
          >
            <FaTimes />
          </button>
          {actionLoading && <span className="text-black">Loading...</span>}
          {actionError && <span className="text-red-500 text-sm">{actionError}</span>}
        </div>
      </td>
    </tr>
  );
};

export default BookingRow; 