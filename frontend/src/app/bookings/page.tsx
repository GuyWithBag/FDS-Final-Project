'use client';

import React from 'react';
import BookingList from '@/app/components/BookingList';

export default function BookingsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">My Bookings</h1>
      <BookingList />
    </main>
  );
}
