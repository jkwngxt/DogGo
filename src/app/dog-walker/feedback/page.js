"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import Review from "@/components/review";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import Loading from "@/components/loading";

// const feedbackData = {
//   averageRating: 4.6,
//   ratingBreakdown: {
//     5: 56,
//     4: 44,
//     3: 0,
//     2: 0,
//     1: 0,
//   },
//   review: [
//     {
//       r_id: 1,
//       u_username: "PP1234",
//       avatar: "/api/placeholder/40/40",
//       rating: 5,
//       r_text: "บริการดีมากๆจะกลับมาใช้บริการอีกค่ะ",
//     },
//     {
//       r_id: 2,
//       u_username: "jaja",
//       avatar: "/api/placeholder/40/40",
//       rating: 5,
//       r_text: "กลับมาน้องร่าเริงขึ้นมากกกก",
//     },
//     {
//       r_id: 3,
//       u_username: "test",
//       avatar: "/api/placeholder/40/40",
//       rating: 4,
//       r_text: "เยี่ยมมากค่ะ",
//     },
//   ],
// };

const FeedbackPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/dog-walker/feedback`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!data.success) {
          setError(
            data.message || "An error occurred while loading the reviews."
          );
        }

        console.log(data);
        setData(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err.message || "An error occurred while loading the reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <Loading />;

  if (error) return <p className="p-2 text-red-600">Error: {error}</p>;

  // Prepare and format the reviews
  const reviewData = data.dogWalkers.reviews
    ? data.dogWalkers.reviews.map((review, index) => ({
        r_id: index + 1,
        u_username: review.username || "",
        rating: review.rating,
        r_text: review.text || "",
        avatar: "/image/user-placeholder.jpg", // Default avatar for now
      }))
    : [];

  const feedbackData = {
    meanRating: data.dogWalkers.meanRating,
    ratingDistribution: data.dogWalkers.ratingDistribution,
    reviews: reviewData,
    ratingCount: data.dogWalkers.ratingCount,
  };

  return (
    <div className="min-h-screen bg-yellow-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-2">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Star size={100} className="fill-yellow-400 text-yellow-400" />
            <div className="text-3xl font-bold">
              {feedbackData.meanRating} จาก 5
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="mt-4 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = feedbackData.ratingDistribution[rating] || 0;
              const percentage =
                feedbackData.ratingCount > 0
                  ? (count / feedbackData.ratingCount) * 100
                  : 0;
              return (
                <div
                  key={rating}
                  className="grid grid-cols-[4rem_1fr_3rem] items-center gap-2"
                >
                  <span className="font-semibold text-lg">{rating} ดาว</span>
                  <div className="w-full h-5 bg-gray-300 border border-black rounded-md">
                    <div
                      className="h-full bg-white border-black rounded-md"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="font-semibold text-right">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews Component */}
        <div className="mt-4">
          <Label className="font-semibold text-2xl">Feedback ที่ได้รับ</Label>
        </div>
        <Card className="mt-4 border-black shadow-md">
          <Review reviewData={feedbackData.reviews} />
        </Card>
      </div>
    </div>
  );
};

export default FeedbackPage;
