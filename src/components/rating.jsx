// Example of compatible Rating.jsx
import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value, onChange }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <Star
            size={24}
            className={star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  );
};

export default Rating;