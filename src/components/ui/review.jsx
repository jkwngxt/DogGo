"use client";

import React, { useState } from 'react';
import { Star } from 'lucide-react';

const Reviews = ({ reviewData }) => {
  const [selectedRating, setSelectedRating] = useState(null);

  const filteredReviews = selectedRating 
    ? reviewData.filter(review => review.rating === selectedRating)
    : reviewData;

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Star Rating Filter */}
      <div className="flex gap-2 mb-6">
        {[5, 4, 3, 2, 1].map((rating) => (
          <button
            key={rating}
            onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full border 
              ${selectedRating === rating 
                ? 'bg-yellow-100 border-yellow-400' 
                : 'bg-white border-gray-200 hover:bg-gray-50'}`}
          >
            <span className="font-medium">{rating}</span>
            <Star
              size={16}
              className={selectedRating === rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
            />
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200">
            <img
              src={review.avatar || '/api/placeholder/40/40'}
              alt={review.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{review.username}</span>
                <div className="flex">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No reviews found for {selectedRating} stars
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;