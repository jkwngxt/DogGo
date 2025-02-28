"use client";

import React from 'react'
import { Label } from "@/components/ui/label";
import Review from "@/components/review";
import { Star } from "lucide-react";
import {Card, CardHeader} from "@/components/ui/card";

const feedbackData = {
  averageRating: 4.6,
  ratingBreakdown: {
    5: 56,
    4: 44,
    3: 0,
    2: 0,
    1: 0,
  },
  review: [
    {
      r_id: 1,
      u_username: "PP1234",
      avatar: "/api/placeholder/40/40",
      rating: 5,
      r_text: "บริการดีมากๆจะกลับมาใช้บริการอีกค่ะ",
    },
    {
      r_id: 2,
      u_username: "jaja",
      avatar: "/api/placeholder/40/40",
      rating: 5,
      r_text: "กลับมาน้องร่าเริงขึ้นมากกกก",
    },
    {
      r_id: 3,
      u_username: "test",
      avatar: "/api/placeholder/40/40",
      rating: 4,
      r_text: "เยี่ยมมากค่ะ",
    },
  ],
};

const FeedbackPage = () => {
  return (
    <div className="min-h-screen bg-yellow-100 p-6">
      <div className="max-w-3xl mx-auto">

        <div className='grid grid-cols-2'>
          {/* Header */}
          <div className="flex items-center gap-4">
            <Star size={100} className="fill-yellow-400 text-yellow-400" />
            <div className="text-3xl font-bold">{feedbackData.averageRating} จาก 5</div>
          </div>

          {/* Rating Breakdown */}
          <div className="mt-4">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className='w-16 font-semibold text-lg mt-3'>{rating} ดาว</span>
                <div className="w-full h-5 bg-gray-300 border-black border-[1px] rounded-md mt-3">
                  <div
                    className="h-[1.15rem] bg-white border-black rounded-md"
                    style={{ width: `${feedbackData.ratingBreakdown[rating]}%` }}
                  />
                </div>
                <span className='mt-3 font-semibold'>{feedbackData.ratingBreakdown[rating]}%</span>
              </div>
            ))}
          </div>
        </div>
        

        {/* Reviews Component */}
        <div className='mt-4'>
          <Label className="font-semibold text-2xl">Feedback ที่ได้รับ</Label>
        </div>
        <Card className="mt-4 border-black shadow-md">
          <Review reviewData={feedbackData.review} />
        </Card>
          
      </div>
    </div>
  );
};

export default FeedbackPage;
