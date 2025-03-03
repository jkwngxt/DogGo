"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import Rating from "@/components/rating";
import ConfirmationDialogs from "@/components/confirmation-dialogs";
import { useRouter } from "next/navigation";

export default function Review() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [walkingServiceId, setWalkingServiceId] = useState(null);

  useEffect(() => {
    const fetchReviewableService = async () => {
      try {
        const response = await fetch("/api/dog-walker/review");
        const data = await response.json();
        
        if (data.success && data.walkingServices.length > 0) {
          setWalkingServiceId(data.walkingServices[0].id); // use first available service ID
        } else {
          setMessage("ไม่มีบริการที่สามารถรีวิวได้");
          setShowErrorDialog(true);
        }
      } catch (error) {
        console.error("Error fetching reviewable services:", error);
      }
    };

    fetchReviewableService();
  }, []);


  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmit = async () => {
    console.log("Submit button clicked");

    if (!walkingServiceId) {
      setMessage("ไม่มีบริการที่สามารถรีวิวได้");
      setShowErrorDialog(true);
      return;
    }

    if (rating > 0) {
      try {
        const response = await fetch("/api/dog-walker/review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walkingServiceId: walkingServiceId, // use fetched service ID
            rating: rating,
            text: review,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setMessage("ทำการส่งรีวิวเรียบร้อย");
          setShowSuccessDialog(true);
        } else {
          setMessage(data.message || "เกิดข้อผิดพลาดในการส่งรีวิว");
          setShowErrorDialog(true);
        }
      } catch (error) {
        console.error("Error submitting review:", error);
        setMessage("เกิดข้อผิดพลาดในการส่งรีวิว");
        setShowErrorDialog(true);
      }
    } else {
      setMessage("โปรดให้คะแนนก่อนส่งรีวิว");
      setShowErrorDialog(true);
    }
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    setShowErrorDialog(false);
    if (showSuccessDialog) {
      console.log("Review submitted:", { rating, review, walkingServiceId });
      router.push("/pet-owner/homepage");
    }

    if (message === "ไม่มีบริการที่สามารถรีวิวได้") {
      router.back(); // go back if no service is available
    }
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

      {/* Success & Error Confirmation Dialogs */}
      <ConfirmationDialogs
        showSuccessDialog={showSuccessDialog}
        showErrorDialog={showErrorDialog}
        message={message}
        onSuccessClose={handleDialogClose}
        onErrorClose={handleDialogClose}
      />
    </>
  );
}
