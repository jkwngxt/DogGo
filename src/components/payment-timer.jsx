"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  // Function to handle payment button click and make the booking API call
  const handlePaymentClick = async () => {
    setIsLoading(true);

    try {
      // ดึงข้อมูลจาก sessionStorage แทนการใช้ URL parameters
      const bookingDataStr = sessionStorage.getItem('bookingData');

      if (!bookingDataStr) {
        setMessage("ข้อมูลการจองไม่ถูกต้อง กรุณาทำรายการใหม่อีกครั้ง");
        setShowErrorDialog(true);
        return;
      }

      const bookingInfo = JSON.parse(bookingDataStr);

      // ตรวจสอบความถูกต้องของข้อมูล
      if (!bookingInfo.dwId || !bookingInfo.startTime || !bookingInfo.endTime ||
          !bookingInfo.date || !Array.isArray(bookingInfo.dogIds) || bookingInfo.dogIds.length === 0) {
        setMessage("ข้อมูลการจองไม่ถูกต้อง กรุณาทำรายการใหม่อีกครั้ง");
        setShowErrorDialog(true);
        return;
      }

      // Get data from sessionStorage
      const dwId = bookingInfo.dwId;
      const date = bookingInfo.date;
      const startTime = parseInt(bookingInfo.startTime);
      const endTime = parseInt(bookingInfo.endTime);
      const dogIds = bookingInfo.dogIds || [];

      // Prepare request body
      const requestBody = {
        dogWalkerId: parseInt(dwId),
        date: date,
        startTimeInt: startTime,
        endTimeInt: endTime,
        dogIds: dogIds,
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
          setMessage(`การจองล้มเหลว กรุณาทำรายการใหม่อีกครั้ง'}`);
        }
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("Error during booking process:", error);
      setMessage("การจองล้มเหลว กรุณาทำรายการใหม่อีกครั้ง");
      setShowErrorDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmClick = async () => {
    if (!bookingData || !bookingData.billingId) {
      setMessage("ข้อมูลการชำระเงินไม่ถูกต้อง กรุณาทำรายการใหม่อีกครั้ง");
      setShowErrorDialog(true);
      setShowPaymentDialog(false);
      return;
    }

    setIsConfirmingPayment(true);

    try {
      // Create payment confirmation request
      const paymentConfirmation = {
        userId: null, // Will be filled by the backend from JWT
        billingId: bookingData.billingId,
        amount: total,
        confirmed: true
      };

      // Send payment confirmation to the backend
      const response = await fetch('/api/walking-service/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentConfirmation),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowPaymentDialog(false); // Close payment dialog

        // ลบข้อมูลการจองจาก sessionStorage เมื่อการชำระเงินเสร็จสิ้น
        sessionStorage.removeItem('bookingData');

        // Show success message after payment confirmation
        setMessage("การชำระเงินเสร็จสิ้น อยู่ระหว่างการยืนยันจาก Dog Walker");
        setShowSuccessDialog(true);

        // Store booking reference if needed
        if (bookingData) {
          localStorage.setItem('latestBookingId', bookingData.walkingServiceId);
        }
      } else {
        // Payment confirmation failed
        setShowPaymentDialog(false);
        setMessage("ไม่สามารถติดต่อกับระบบชำระเงินได้");

        // Cancel the booking if payment confirmation fails
        if (bookingData && bookingData.walkingServiceId) {
          await cancelBooking(bookingData.walkingServiceId);
        }

        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("Error during payment confirmation:", error);
      setShowPaymentDialog(false);
      setMessage("ไม่สามารถติดต่อกับระบบชำระเงินได้");

      // Cancel the booking if payment confirmation throws an error
      if (bookingData && bookingData.walkingServiceId) {
        await cancelBooking(bookingData.walkingServiceId);
      }

      setShowErrorDialog(true);
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  // Function to cancel the booking when timer expires or other cancellation events
  const cancelBooking = async (walkingServiceId) => {
    try {
      const response = await fetch('/api/walking-service/change-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "status": 210, // Cancelled status code
          "walkingServiceId": walkingServiceId,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("Error cancelling booking:", error);
      return false;
    }
  };

  const handleErrorDialogClose = () => {
    setShowErrorDialog(false);
    // ลบข้อมูลการจองจาก sessionStorage เมื่อเกิดข้อผิดพลาด
    sessionStorage.removeItem('bookingData');
    // Redirect to home page when error dialog is closed
    router.push("/pet-owner/walking-service");
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    // Redirect to dashboard after successful payment
    router.push(`/pet-owner/walk-description?wId=${bookingData.walkingServiceId}`);
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
            // เมื่อเวลาหมด ให้ลบข้อมูลการจองจาก sessionStorage
            sessionStorage.removeItem('bookingData');
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

  // เพิ่ม effect ที่จะจัดการเมื่อเวลาหมด
  useEffect(() => {
    if (timeLeft === 0 && showPaymentDialog) {
      setShowPaymentDialog(false);

      // Cancel the booking on the server when timer expires
      if (bookingData && bookingData.walkingServiceId) {
        cancelBooking(bookingData.walkingServiceId);
      }

      sessionStorage.removeItem('bookingData');
      setMessage("เวลาในการชำระเงินหมดลง การจองถูกยกเลิก");
      setShowErrorDialog(true);
    }
  }, [timeLeft, showPaymentDialog, bookingData]);

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
              <Button
                  onClick={handleConfirmClick}
                  disabled={isConfirmingPayment}
              >
                {isConfirmingPayment ? "กำลังยืนยัน..." : "เสร็จสิ้น"}
              </Button>
              <Button
                  variant="destructive"
                  onClick={() => {
                    // Cancel the booking when user manually cancels
                    if (bookingData && bookingData.walkingServiceId) {
                      cancelBooking(bookingData.walkingServiceId);
                    }
                    // ลบข้อมูลการจองจาก sessionStorage เมื่อผู้ใช้ยกเลิก
                    sessionStorage.removeItem('bookingData');
                    // ปิด payment dialog
                    setShowPaymentDialog(false);
                    // แสดง error dialog
                    setMessage("การชำระเงินล้มเหลว การจองของคุณถูกยกเลิก");
                    setShowErrorDialog(true);
                  }}
              >
                ยกเลิก
              </Button>
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