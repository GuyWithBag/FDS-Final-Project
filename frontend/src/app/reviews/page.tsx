'use client';

import React from 'react';
import ReviewList from '@/app/components/ReviewList';
import ReviewForm from '@/app/components/ReviewForm';

export default function ReviewsPage() {
  // ReviewList component has a fetchReviews function that can be used to refresh the list.
  // We need a way to trigger this function from ReviewForm after a successful submission.
  // This can be done by passing the fetchReviews function down as a prop.

  // However, ReviewList is a component that fetches its own data on mount.
  // A simpler approach for this minimal example is to let ReviewList manage its own state and fetching,
  // and trigger a re-fetch by calling the function instance obtained from a ref or context,
  // or by using a key prop change if ReviewList was designed that way.

  // For this simple setup, we'll make a minor adjustment to ReviewList to expose a refresh function
  // or pass the refresh trigger down via props from a parent state (which is page.tsx).

  // Let's modify ReviewList slightly to accept an `onReviewAdded` prop
  // or just rely on the inherent re-fetch when the page potentially re-renders (less ideal but simplest).

  // A more robust way is to lift the state or use a global state/context, but for simplicity, 
  // let's assume ReviewList will re-fetch when its parent (ReviewsPage) causes a re-render 
  // or we pass a refresh function down.

  // Let's add a simple state in the parent to force ReviewList refresh when needed.
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const handleReviewAdded = () => {
    // Increment the trigger state to force ReviewList to re-fetch (assuming it listens to this prop/state)
    // OR, if ReviewList exposes a refetch function, call it directly.
    // Since ReviewList doesn't expose a refetch directly, incrementing the key prop is a common pattern
    // to force a component to re-mount and re-fetch its data.
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Customer Reviews</h1>
      
      {/* Pass the handleReviewAdded function to ReviewForm */}
      <ReviewForm onReviewAdded={handleReviewAdded} />

      {/* Render the ReviewList and use the refreshTrigger as a key to force re-fetch on review added */}
      {/* Note: Using key for re-fetch is a simple but sometimes less performant method. */} 
      {/* For larger apps, consider state management or context. */}
      <ReviewList key={refreshTrigger} />

    </main>
  );
}
