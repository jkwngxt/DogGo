"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import ConfirmationDialogs from "./confirmation-dialogs";

const PaymentTimer = ({ total }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  // Function to handle payment button click and make the booking API call
  const handlePaymentClick = async () => {
    setIsLoading(true);

    try {
      // Get data from URL parameters to prepare the booking request
      const dwId = searchParams.get('dwId');
      const date = searchParams.get('date');
      const startTime = parseInt(searchParams.get('startTime'));
      const endTime = parseInt(searchParams.get('endTime'));
      const dogsParam = searchParams.get('dogs');

      // Parse dogs JSON array
      let dogsList = [];
      try {
        if (dogsParam) {
          dogsList = JSON.parse(dogsParam);
        }
      } catch (error) {
        console.error('Error parsing dogs data:', error);
      }

      // Define constants
      const START_TIME = 9; // 9:00 AM is the first slot

      // Calculate slot indices
      let start = startTime - START_TIME + 1;
      let end = endTime - START_TIME + 1;

      // Generate array of slots
      const timeSlots = [];
      for (let i = start; i < end; i++) {
        timeSlots.push(i);
      }

      // Prepare request body
      const requestBody = {
        dogWalkerId: parseInt(dwId),
        date: date,
        startTimeInt: startTime,
        endTimeInt: endTime,
        dogIds: dogsList,
        price: total
      };

      // Make API call to book dog walker
      const response = await fetch('/api/user/booking-dw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        // Booking successful - open payment dialog without notification
        setBookingData(data);
        setShowPaymentDialog(true);
      } else {
        // Booking failed - show appropriate error message
        if (data.altFlow) {
          // This is a controlled error from our backend (like time slot conflict)
          setMessage(`พนักงานพาสุนัขเดินคนนี้มีการจองในช่วงเวลาที่คุณเลือกแล้ว กรุณาเลือกช่วงเวลาอื่น`);
        } else {
          // Unexpected error
          setMessage(`การจองล้มเหลว: ${data.error || 'เกิดข้อผิดพลาดในระบบ'}`);
        }
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("Error during booking process:", error);
      setMessage("การจองล้มเหลว: ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      setShowErrorDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmClick = () => {
    setShowPaymentDialog(false); // Close payment dialog

    // Show success message after payment confirmation
    setMessage("การชำระเงินเสร็จสิ้น อยู่ระหว่างการยืนยันจาก Dog Walker");
    setShowSuccessDialog(true);

    // Store booking reference if needed
    if (bookingData) {
      localStorage.setItem('latestBookingId', bookingData.walkingServiceId);
    }
  };

  const handleErrorDialogClose = () => {
    setShowErrorDialog(false);
    // Redirect to home page when error dialog is closed
    router.push('/');
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    // Redirect to dashboard after successful payment
    router.push('/dashboard');
  };

  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)
  const timerRef = useRef(null);

  useEffect(() => {
    if (showPaymentDialog && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [showPaymentDialog]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
      <>
        {/* Payment Button - Makes the API call directly */}
        <Button
            variant="default"
            onClick={handlePaymentClick}
            disabled={isLoading}
        >
          {isLoading ? "กำลังดำเนินการ..." : "ชำระเงิน"}
        </Button>

        {/* Payment Dialog with QR Code - Shown after booking API call succeeds */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="sm:max-w-md flex flex-col items-center">
            <img
                src="/image/payment-qr.png"
                alt="qr-code"
            />
            <DialogHeader className="flex items-center">
              <DialogTitle>{total} บาท</DialogTitle>
              <DialogDescription className="text-sm text-black">
                ชื่อบัญชี: บริษัท DogGo Thailand
              </DialogDescription>
              <DialogDescription className="text-md text-black">
                โปรดชำระเงินภายใน
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center text-2xl font-bold">
              {formatTime(timeLeft)} นาที
            </div>
            <DialogFooter className="sm:justify-center">
              <Button onClick={handleConfirmClick}>เสร็จสิ้น</Button>
              <DialogClose asChild>
                <Button variant="destructive">ยกเลิก</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success & Error Confirmation Dialogs */}
        <ConfirmationDialogs
            showSuccessDialog={showSuccessDialog}
            showErrorDialog={showErrorDialog}
            message={message}
            onSuccessClose={handleSuccessDialogClose}
            onErrorClose={handleErrorDialogClose}
        />
      </>
  );
};

export default PaymentTimer;