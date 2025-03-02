"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import Rating from "@/components/rating";
import Confirmation from "@/components/confirmation";
import { useRouter } from "next/navigation";

export default function Review() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [showSuccessConfirmation, setShowSuccessConfirmation] = useState(false);
  const [showFailConfirmation, setShowFailConfirmation] = useState(false);

  // This assumes your Rating component accepts an onChange prop
  // If it doesn't, you'll need to modify your Rating component
  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmit = () => {
    console.log("Submit button clicked");
    if (rating > 0) {
      // If rating is selected, show success confirmation
      setShowSuccessConfirmation(true);
    } else {
      // If no rating is selected, show fail confirmation
      setShowFailConfirmation(true);
    }
  };

  const handleCloseSuccessConfirmation = () => {
    setShowSuccessConfirmation(false);
    // Navigate to another page or perform other actions after successful submission
    console.log("Review submitted:", { rating, review });
    router.push("/pet-owner/homepage");
  };

  const handleCloseFailConfirmation = () => {
    setShowFailConfirmation(false);
    // Just close the dialog and let the user select a rating
  };

  return (
    <>
      <div className="p-4 space-y-4">
        <div className="flex flex-col px-10 items-center">
          <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
            ให้คะแนนการใช้บริการ
          </h1>
          <Card className="w-[100%] sm:w-[60%] md:w-[60%] lg:w-[80%] p-6 py-10 h-[70vh] flex flex-col justify-between items-center">
            {/* Content */}
            <div className="space-y-4 w-[80%] text-left flex-grow">
              <h2 className="font-bold text-md">ให้คะแนน</h2>
              <Rating value={rating} onChange={handleRatingChange} />
              <h2 className="font-bold text-md">เขียนรีวิว</h2>
              <Textarea 
                className="h-[200px]" 
                placeholder="เขียนรีวิว" 
                value={review}
                onChange={handleReviewChange}
              />
            </div>

            {/* Buttons at the bottom */}
            <div className="flex flex-row space-x-4 justify-center">
              <Button onClick={handleSubmit}>เสร็จสิ้น</Button>
              <Button variant="destructive" onClick={() => router.back()}>ยกเลิก</Button>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Success Confirmation Dialog */}
      <Confirmation 
        status="success"
        open={showSuccessConfirmation}
        onOpenChange={setShowSuccessConfirmation}
        message="ทำการส่งรีวิวเรียบร้อย"
        action={handleCloseSuccessConfirmation}
      />

      {/* Fail Confirmation Dialog */}
      <Confirmation 
        status="fail"
        open={showFailConfirmation}
        onOpenChange={setShowFailConfirmation}
        message="โปรดให้คะแนน"
        action={handleCloseFailConfirmation}
      />
    </>
  );
}