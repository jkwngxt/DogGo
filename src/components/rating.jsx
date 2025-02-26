"use client";
import { Star } from 'lucide-react';
import { useState } from 'react';

const Rating = () => {
  const [rating, setRating] = useState(0); // State to store the rating

  const handleClick = (value) => {
    setRating(value); // Update the rating when a star is clicked
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <div
          key={value}
          onClick={() => handleClick(value)} 
          className={`cursor-pointer p-1 
            ${value <= rating
              ? 'text-yellow-400'  // Fill the star yellow when selected
              : 'text-gray-400 hover:text-gray-600'}  
            transition duration-200 ease-in-out`}
        >
          <Star size={24} className={value <= rating ? 'fill-yellow-400' : ''} />
        </div>
      ))}
    </div>
  );
};

export default Rating;
