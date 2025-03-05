"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import ConfirmationDialogs from "./confirmation-dialogs";

// เพิ่ม prop bookingInfo เพื่อรับข้อมูลจาก Billing component
const PaymentTimer = ({ total, bookingInfo }) => {
  const router = useRouter();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [bookingData, setBookingData] = useState(null);
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
            sessionStorage.removeItem('selectedDogWalker');
            sessionStorage.removeItem('walkingServiceSearch');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
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

      // บันทึกข้อมูลการยกเลิกเนื่องจากหมดเวลาลงใน localStorage
      const bookingResultStr = localStorage.getItem('lastBookingResult');
      if (bookingResultStr) {
        const bookingResult = JSON.parse(bookingResultStr);
        const updatedBookingResult = {
          ...bookingResult,
          paymentStatus: 'timeout',
          timeoutTimestamp: new Date().toISOString()
        };

        localStorage.setItem('lastBookingResult', JSON.stringify(updatedBookingResult));
      }

      sessionStorage.removeItem('bookingData');
      sessionStorage.removeItem('selectedDogWalker');
      sessionStorage.removeItem('walkingServiceSearch');
      setMessage("เวลาในการชำระเงินหมดลง การจองถูกยกเลิก");
      setShowErrorDialog(true);
    }
  }, [timeLeft, showPaymentDialog, bookingData]);

  // Function to handle payment button click and make the booking API call
  const handlePaymentClick = async () => {
    setIsLoading(true);

    try {
      // ตรวจสอบความถูกต้องของข้อมูลการจองที่ได้รับจาก props
      if (!bookingInfo || !bookingInfo.dogWalkerId || !bookingInfo.startTimeInt ||
          !bookingInfo.endTimeInt || !bookingInfo.date ||
          !Array.isArray(bookingInfo.dogIds) || bookingInfo.dogIds.length === 0) {
        setMessage("ข้อมูลการจองไม่ถูกต้อง กรุณาทำรายการใหม่อีกครั้ง");
        setShowErrorDialog(true);
        return;
      }

      // Make API call to book dog walker
      const response = await fetch('/api/user/booking-dw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingInfo),
      });

      const data = await response.json();

      if (response.ok) {
        // ใช้ข้อมูลที่ได้จาก API
        setBookingData({
          billingId: data.billingId,
          walkingServiceId: data.walkingServiceId,
          amount: data.amount || total
        });

        // สร้างข้อมูลผลลัพธ์การจองจาก API response และ bookingInfo
        const bookingResult = {
          dogWalkerId: bookingInfo.dogWalkerId,
          date: bookingInfo.date,
          startTime: bookingInfo.startTimeInt,
          endTime: bookingInfo.endTimeInt,
          dogIds: bookingInfo.dogIds,
          dogNames: bookingInfo.dogNames || [],
          walkingServiceId: data.walkingServiceId,
          billingId: data.billingId,
          total: data.amount || total,
          dwName: bookingInfo.dogWalkerName,
          bookingTimestamp: new Date().toISOString()
        };

        localStorage.setItem('lastBookingResult', JSON.stringify(bookingResult));

        setShowPaymentDialog(true);
        // รีเซ็ตเวลาเมื่อแสดง dialog
        setTimeLeft(600);
      } else {
        // Booking failed - show appropriate error message
        if (data.altFlow) {
          // This is a controlled error from our backend (like time slot conflict)
          setMessage(`พนักงานพาสุนัขเดินคนนี้มีการจองในช่วงเวลาที่คุณเลือกแล้ว กรุณาเลือกช่วงเวลาอื่น`);
        } else {
          // Unexpected error
          console.log(data)
          setMessage(`การจองล้มเหลว: ${data.error || 'กรุณาทำรายการใหม่อีกครั้ง'}`);
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
      // ใช้ข้อมูลจาก API (bookingData)
      const paymentAmount = bookingData.amount || total;

      // Create payment confirmation request
      const paymentConfirmation = {
        userId: null, // Will be filled by the backend from JWT
        billingId: bookingData.billingId,
        amount: paymentAmount,
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

      console.log(data);

      if (response.ok) {
        setShowPaymentDialog(false); // Close payment dialog

        // ดึงข้อมูลการจองจาก localStorage
        const bookingResultStr = localStorage.getItem('lastBookingResult');
        const bookingResult = bookingResultStr ? JSON.parse(bookingResultStr) : null;

        // อัพเดทสถานะการชำระเงินใน localStorage
        if (bookingResult) {
          const updatedBookingResult = {
            ...bookingResult,
            paymentStatus: 'completed',
            paymentTimestamp: new Date().toISOString()
          };

          localStorage.setItem('lastBookingResult', JSON.stringify(updatedBookingResult));
        }

        // ลบข้อมูลการจองจาก sessionStorage เมื่อการชำระเงินเสร็จสิ้น
        sessionStorage.removeItem('bookingData');
        sessionStorage.removeItem('selectedDogWalker');
        sessionStorage.removeItem('walkingServiceSearch');

        // Show success message after payment confirmation
        setMessage("การชำระเงินเสร็จสิ้น อยู่ระหว่างการยืนยันจาก Dog Walker");
        setShowSuccessDialog(true);
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
      // อัพเดทสถานะการยกเลิกใน localStorage
      const bookingResultStr = localStorage.getItem('lastBookingResult');
      if (bookingResultStr) {
        const bookingResult = JSON.parse(bookingResultStr);
        const updatedBookingResult = {
          ...bookingResult,
          paymentStatus: 'cancelled',
          cancelTimestamp: new Date().toISOString()
        };

        localStorage.setItem('lastBookingResult', JSON.stringify(updatedBookingResult));
      }

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
    sessionStorage.removeItem('selectedDogWalker');
    sessionStorage.removeItem('walkingServiceSearch');
    // Redirect to home page when error dialog is closed
    router.push("/pet-owner/walking-service");
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);

    // ดึงข้อมูลการจองล่าสุดจาก localStorage
    const bookingResultStr = localStorage.getItem('lastBookingResult');
    const bookingResult = bookingResultStr ? JSON.parse(bookingResultStr) : null;

    // Redirect to dashboard after successful payment
    if (bookingResult && bookingResult.walkingServiceId) {
      router.push(`/pet-owner/walk-description?wId=${bookingResult.walkingServiceId}`);
    } else {
      router.push("/pet-owner/walking-service");
    }
  };

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
              <DialogTitle>
                {bookingData && bookingData.amount ? bookingData.amount : total} บาท
              </DialogTitle>
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
                    sessionStorage.removeItem('selectedDogWalker');
                    sessionStorage.removeItem('walkingServiceSearch');
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