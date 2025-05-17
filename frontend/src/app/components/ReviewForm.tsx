'use client';

import React, { useState, useEffect } from 'react';
import { Review } from '@/types/Review';
import { TourPackage } from '@/types/TourPackage';
import { Hotel } from '@/types/Hotel'; // Assuming you'll create a Hotel type
import { Activity } from '@/types/Activity'; // Assuming you'll create an Activity type

interface ReviewFormProps {
  onReviewAdded: () => void; // Callback to refresh the list
  // In a real app, you might pass a bookingID here to link the review
  // bookingId?: number;
}

// Simplification: In a real app, you'd likely link a review to a completed booking
// and allow reviewing the package, hotel, and activities within that booking.
// For this minimal example, we'll allow selecting from all packages/hotels/activities.

const ReviewForm: React.FC<ReviewFormProps> = ({ onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  // State for selecting what is being reviewed
  const [reviewedItemType, setReviewedItemType] = useState<'package' | 'hotel' | 'activity' | ''>('');
  const [reviewedItemId, setReviewedItemId] = useState<number | null>(null);

  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch lists of items to review (packages, hotels, activities)
  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Assuming backend endpoints exist for listing these items
        const [packagesRes, hotelsRes, activitiesRes] = await Promise.all([
          fetch('http://localhost:3001/api/tour-packages'),
          fetch('http://localhost:3001/api/hotels'),
          fetch('http://localhost:3001/api/activities'),
        ]);

        const packagesData = await packagesRes.json();
        const hotelsData = await hotelsRes.json();
        const activitiesData = await activitiesRes.json();

        setPackages(packagesData);
        setHotels(hotelsData);
        setActivities(activitiesData);

      } catch (err: any) {
        setItemsError(err.message || 'Failed to load items for review');
      } finally {
        setItemsLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!rating || rating < 1 || rating > 5 || !comment || !reviewedItemType || reviewedItemId === null) {
      setError('Please provide a rating, comment, and select an item to review.');
      setLoading(false);
      return;
    }

    // TODO: Replace with actual logged-in user ID
    const userId = 1;
    // TODO: If linking to booking, get bookingId
    const bookingId = null; // For now, not linked to a specific booking

    const reviewData: any = {
      userID: userId,
      reviewDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      rating: rating,
      comment: comment,
      bookingID: bookingId,
    };

    // Add reviewed item ID based on type
    if (reviewedItemType === 'package') reviewData.packageID = reviewedItemId;
    else if (reviewedItemType === 'hotel') reviewData.hotelID = reviewedItemId;
    else if (reviewedItemType === 'activity') reviewData.activityID = reviewedItemId;

    try {
      const res = await fetch('http://localhost:3001/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      const data = await res.json();
      setSuccess('Review submitted successfully!');
      setRating(5); // Reset form
      setComment('');
      setReviewedItemType('');
      setReviewedItemId(null);
      onReviewAdded(); // Refresh the list

    } catch (err: any) {
      setError(err.message || 'Unknown submission error');
    } finally {
      setLoading(false);
    }
  };

   // Helper to get items list based on selected type
   const getItemsList = () => {
    if (reviewedItemType === 'package') return packages;
    if (reviewedItemType === 'hotel') return hotels;
    if (reviewedItemType === 'activity') return activities;
    return [];
  };

  // Helper to get item display name
  const getItemDisplayName = (item: any) => {
      if (reviewedItemType === 'package') return item.PackageName;
      if (reviewedItemType === 'hotel') return item.hotelName; // Note: hotelName field in Hotel type
      if (reviewedItemType === 'activity') return item.activityName; // Note: activityName field in Activity type
      return 'Select Item';
  };

   // Helper to get item ID field name
   const getItemIdFieldName = () => {
      if (reviewedItemType === 'package') return 'packageID';
      if (reviewedItemType === 'hotel') return 'hotelID';
      if (reviewedItemType === 'activity') return 'activityID';
      return '';
   };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold mb-4 text-black">Leave a Review</h3>
       {itemsLoading && <p className="text-black">Loading items for review...</p>}
       {itemsError && <p className="text-red-500">Error loading items: {itemsError}</p>}
      {!itemsLoading && !itemsError && (
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reviewedItemType" className="block text-sm font-medium text-black">Review Type</label>
              <select
                id="reviewedItemType"
                value={reviewedItemType}
                onChange={(e) => {
                    setReviewedItemType(e.target.value as 'package' | 'hotel' | 'activity' | '');
                    setReviewedItemId(null); // Reset item ID when type changes
                }}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-black"
              >
                <option value="" className="text-black">Select type</option>
                <option value="package" className="text-black">Tour Package</option>
                <option value="hotel" className="text-black">Hotel</option>
                <option value="activity" className="text-black">Activity</option>
              </select>
            </div>

            {reviewedItemType && (
                 <div>
                   <label htmlFor="reviewedItem" className="block text-sm font-medium text-black">Select Item</label>
                    <select
                       id="reviewedItem"
                       value={reviewedItemId || ''}
                       onChange={(e) => setReviewedItemId(parseInt(e.target.value))}
                       required
                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-black"
                     >
                       <option value="" className="text-black">-- Select an item --</option>
                       {getItemsList().map((item: any) => (
                         <option key={item[getItemIdFieldName()]} value={item[getItemIdFieldName()]} className="text-black">{getItemDisplayName(item)}</option>
                       ))}
                    </select>
                 </div>
            )}

            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-black">Rating (1-5)</label>
              <input
                type="number"
                id="rating"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                required
                min="1"
                max="5"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-black"
              />
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-black">Comment</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-black"
              ></textarea>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-500 text-sm">{success}</div>}

            <button
              type="submit"
              disabled={loading || itemsLoading}
              className={`w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading || itemsLoading ? 'bg-orange-400' : 'bg-orange-600 hover:bg-orange-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
         </form>
      )}
    </div>
  );
};

export default ReviewForm;
