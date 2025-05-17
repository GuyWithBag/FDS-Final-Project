import React from 'react';
import { Review } from '@/types/Review';
import { FaStar, FaRegStar } from 'react-icons/fa';

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  // Helper to display the reviewed item (Package, Hotel, or Activity)
  const getReviewedItemName = () => {
    if (review.PackageName) return `Package: ${review.PackageName}`;
    if (review.HotelName) return `Hotel: ${review.HotelName}`;
    if (review.ActivityName) return `Activity: ${review.ActivityName}`;
    return 'General Review';
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
      <div className="flex items-center mb-2">
        <div className="font-bold text-blue-700 mr-2">{review.FirstName} {review.LastName}</div>
        <div className="text-sm text-black">{new Date(review.reviewDate).toLocaleDateString()}</div>
      </div>
      <div className="text-black mb-2">
        <span className="font-semibold">Rating:</span>
        {[...Array(5)].map((_, index) => {
          return index < review.rating ? (
            <FaStar key={index} className="text-yellow-500 inline-block mx-px" />
          ) : (
            <FaRegStar key={index} className="text-gray-300 inline-block mx-px" />
          );
        })}
      </div>
      <div className="text-black mb-2">
        <span className="font-semibold">Item:</span> {getReviewedItemName()}
      </div>
      {review.comment && (
        <p className="text-black italic">"{review.comment}"</p>
      )}
    </div>
  );
};

export default ReviewItem;
