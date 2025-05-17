'use client';

import React, { useEffect, useState } from 'react';
import { Review } from '@/types/Review';
import ReviewItem from './ReviewItem'; // Import the ReviewItem component

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      // Assuming backend endpoint for fetching all reviews
      const res = await fetch('http://localhost:3001/api/reviews');
      if (!res.ok) throw new Error('Failed to fetch reviews');
      const data = await res.json();
      setReviews(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // This function will be passed to ReviewForm to refresh the list after a new review is added
  const handleNewReview = () => {
    fetchReviews(); // Re-fetch the list of reviews
  };

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (reviews.length === 0) return <div>No reviews found yet.</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">All Reviews</h2>
      <div className="space-y-4">
        {reviews.map(review => (
          <ReviewItem key={review.reviewID} review={review} />
        ))}
      </div>
      {/* ReviewForm will be added below this list on the main page */}
    </div>
  );
};

export default ReviewList;
