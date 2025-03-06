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
  const [dialogTitle, setDialogTitle] = useState(""); // เพิ่ม state เก็บหัวข้อ dialog
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(999999); // เริ่มต้นที่ค่าสูงๆ แทนที่จะเป็น 0
  const timerRef = useRef(null);

  useEffect(() => {
    console.log("Timer useEffect triggered");
    console.log("showPaymentDialog:", showPaymentDialog);
    console.log("timerRef.current:", timerRef.current);
    console.log("bookingData:", bookingData);

    if (showPaymentDialog && !timerRef.current && bookingData && bookingData.deadline) {
      console.log("Creating timer with deadline:", bookingData.deadline);

      // สร้างฟังก์ชันอัพเดท timeLeft
      const updateTimeLeft = () => {
        try {
          // ตรวจสอบว่ามี deadline หรือไม่
          if (!bookingData.deadline) {
            console.warn('No deadline available');
            return;
          }

          // แปลง deadline string จาก ISO format ให้เป็น Date object
          const deadlineTime = new Date(bookingData.deadline).getTime();
          const currentTime = new Date().getTime();

          console.log(`Current time: ${new Date(currentTime).toISOString()}`);
          console.log(`Deadline: ${new Date(deadlineTime).toISOString()}`);

          // คำนวณเวลาที่เหลือเป็นวินาที - แก้ไขตรงนี้ ต้องหารด้วย 1000
          const diffMs = deadlineTime - currentTime;
          const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));

          console.log(`Time difference (ms): ${diffMs}`);
          console.log(`Time difference (seconds): ${diffSeconds}`);

          setTimeLeft(diffSeconds);

          if (diffSeconds <= 0) {
            console.warn('Time expired - clearing timer');
            clearInterval(timerRef.current);
            timerRef.current = null;
            // เมื่อเวลาหมด ให้ลบข้อมูลการจองจาก sessionStorage
            sessionStorage.removeItem('bookingData');
            sessionStorage.removeItem('selectedDogWalker');
            sessionStorage.removeItem('walkingServiceSearch');
          }
        } catch (error) {
          console.error('Error calculating time left:', error);
          // กรณีมีข้อผิดพลาดในการคำนวณเวลา ให้ใช้เวลาเป็น 0
          setTimeLeft(0);
        }
      };

      // อัพเดทค่าเวลาทันที
      updateTimeLeft();

      // ตั้ง interval เพื่ออัพเดทเวลาทุกวินาที
      timerRef.current = setInterval(updateTimeLeft, 1000);
      console.log("Timer interval created");
    }

    return () => {
      if (timerRef.current) {
        console.log("Cleaning up timer interval");
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [showPaymentDialog, bookingData]);

  // เพิ่ม effect ที่จะจัดการเมื่อเวลาหมด
  useEffect(() => {
    console.log(`timeLeft changed: ${timeLeft}`);

    if (timeLeft === 0 && showPaymentDialog) {
      console.log("Timer expired - closing payment dialog");
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

      // ปรับปรุงข้อความและหัวข้อให้สุภาพ
      setDialogTitle("เวลาชำระเงินหมดลง");
      setMessage("ขออภัย เวลาในการชำระเงินได้หมดลงแล้ว การจองของท่านถูกยกเลิกโดยอัตโนมัติ กรุณาทำรายการใหม่อีกครั้ง");
      setShowErrorDialog(true);
    }
  }, [timeLeft, showPaymentDialog, bookingData]);

  // Function to handle payment button click and make the booking API call
  const handlePaymentClick = async () => {
    console.log("Payment button clicked");
    setIsLoading(true);

    try {
      // ตรวจสอบความถูกต้องของข้อมูลการจองที่ได้รับจาก props
      console.log("Booking info:", bookingInfo);

      if (!bookingInfo || !bookingInfo.dogWalkerId || !bookingInfo.startTimeInt ||
          !bookingInfo.endTimeInt || !bookingInfo.date ||
          !Array.isArray(bookingInfo.dogIds) || bookingInfo.dogIds.length === 0) {
        console.error("Invalid booking info", bookingInfo);
        setDialogTitle("ข้อมูลไม่ครบถ้วน");
        setMessage("ขออภัย ข้อมูลการจองไม่ครบถ้วน กรุณาตรวจสอบและทำรายการใหม่อีกครั้ง");
        setShowErrorDialog(true);
        return;
      }

      // Make API call to book dog walker
      console.log("Sending booking request:", JSON.stringify(bookingInfo));
      const response = await fetch('/api/user/booking-dw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingInfo),
      });

      const data = await response.json();
      console.log("Booking API response:", data);

      if (response.ok) {
        // เก็บข้อมูลจาก API response
        console.log("Booking successful:", data);

        // เก็บข้อมูลการจอง
        setBookingData({
          billingId: data.billingId,
          walkingServiceId: data.walkingServiceId,
          amount: data.amount || total,
          deadline: data.deadline // เก็บ deadline จาก API response
        });

        console.log("Set booking data with deadline:", data.deadline);

        // สร้างข้อมูลผลลัพธ์การจองสำหรับเก็บใน localStorage
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
          bookingTimestamp: new Date().toISOString(),
          deadline: data.deadline
        };

        localStorage.setItem('lastBookingResult', JSON.stringify(bookingResult));
        setShowPaymentDialog(true);
        console.log("Payment dialog opened");

      } else {
        // Booking failed - show appropriate error message
        console.error("Booking failed:", data);
        if (data.altFlow) {
          // This is a controlled error from our backend (like time slot conflict)
          setDialogTitle("ช่วงเวลาไม่ว่าง");
          setMessage(`ขออภัย พนักงานพาสุนัขเดินท่านนี้มีการจองในช่วงเวลาที่ท่านเลือกแล้ว กรุณาเลือกช่วงเวลาอื่น หรือพนักงานท่านอื่น`);
        } else {
          // Unexpected error
          console.log(data)
          setDialogTitle("เกิดข้อผิดพลาด");
          setMessage(`ขออภัย เกิดข้อผิดพลาดในการจอง: ${data.error || 'กรุณาลองใหม่อีกครั้งในภายหลัง'}`);
        }
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("Error during booking process:", error);
      setDialogTitle("เกิดข้อผิดพลาด");
      setMessage("ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ กรุณาลองใหม่อีกครั้งในภายหลัง");
      setShowErrorDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmClick = async () => {
    console.log("Confirm payment clicked");
    if (!bookingData || !bookingData.billingId) {
      console.error("Invalid booking data for payment confirmation", bookingData);
      setDialogTitle("ข้อมูลไม่ถูกต้อง");
      setMessage("ขออภัย ข้อมูลการชำระเงินไม่ถูกต้อง กรุณาทำรายการใหม่อีกครั้ง");
      setShowErrorDialog(true);
      setShowPaymentDialog(false);
      return;
    }

    setIsConfirmingPayment(true);

    try {
      // ใช้ข้อมูลจาก API (bookingData)
      const paymentAmount = bookingData.amount || total;
      console.log("Confirming payment for amount:", paymentAmount);

      // Create payment confirmation request
      const paymentConfirmation = {
        userId: null, // Will be filled by the backend from JWT
        billingId: bookingData.billingId,
        amount: paymentAmount,
        confirmed: true
      };

      // Send payment confirmation to the backend
      console.log("Sending payment confirmation:", paymentConfirmation);
      const response = await fetch('/api/walking-service/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentConfirmation),
      });

      const data = await response.json();
      console.log("Payment confirmation response:", data);

      if (response.ok) {
        console.log("Payment confirmation successful");
        setShowPaymentDialog(false); // Close payment dialog

        // Show success message after payment confirmation
        setDialogTitle("ชำระเงินสำเร็จ");
        setMessage("การชำระเงินสำเร็จเรียบร้อยแล้ว ขณะนี้อยู่ระหว่างการยืนยันจากพนักงานพาสุนัขเดิน ขอบคุณที่ใช้บริการของเรา");
        setShowSuccessDialog(true);
      } else {
        // Payment confirmation failed
        console.error("Payment confirmation failed:", data);
        setShowPaymentDialog(false);
        setDialogTitle("ชำระเงินไม่สำเร็จ");
        setMessage("ขออภัย ไม่สามารถยืนยันการชำระเงินได้ในขณะนี้ กรุณาลองใหม่อีกครั้งในภายหลัง");

        // Cancel the booking if payment confirmation fails
        if (bookingData && bookingData.walkingServiceId) {
          await cancelBooking(bookingData.walkingServiceId);
        }

        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("Error during payment confirmation:", error);
      setShowPaymentDialog(false);
      setDialogTitle("เกิดข้อผิดพลาด");
      setMessage("ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบชำระเงิน กรุณาลองใหม่อีกครั้งในภายหลัง");

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
    console.log("Cancelling booking:", walkingServiceId);
    try {
      // อัพเดทสถานะการยกเลิกใน localStorage
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
      console.log("Booking cancellation response:", response.ok);
      return response.ok;
    } catch (error) {
      console.error("Error cancelling booking:", error);
      return false;
    }
  };

  const handleErrorDialogClose = () => {
    console.log("Error dialog closed");
    setShowErrorDialog(false);
    // ลบข้อมูลการจองจาก sessionStorage เมื่อเกิดข้อผิดพลาด
    sessionStorage.removeItem('bookingData');
    sessionStorage.removeItem('selectedDogWalker');
    sessionStorage.removeItem('walkingServiceSearch');
    // Redirect to home page when error dialog is closed
    router.push("/pet-owner/walking-service");
  };

  const handleSuccessDialogClose = () => {
    console.log("Success dialog closed");
    setShowSuccessDialog(false);

    // ดึงข้อมูลการจองล่าสุดจาก localStorage
    const bookingResultStr = localStorage.getItem('lastBookingResult');
    const bookingResult = bookingResultStr ? JSON.parse(bookingResultStr) : null;
    console.log("Last booking result:", bookingResult);

    // Redirect to dashboard after successful payment
    if (bookingResult && bookingResult.walkingServiceId) {
      console.log("Redirecting to walk description:", bookingResult.walkingServiceId);
      router.push(`/pet-owner/walk-description?wId=${bookingResult.walkingServiceId}`);
    } else {
      console.log("Redirecting to walking service");
      router.push("/pet-owner/walking-service");
    }
  };

  const formatTime = (seconds) => {
    console.log(`Formatting time: ${seconds} seconds`);

    if (seconds <= 0) {
      console.log("Time is zero or negative");
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formattedTime = `${minutes}:${secs.toString().padStart(2, "0")}`;
    console.log(`Formatted time: ${formattedTime}`);
    return formattedTime;
  };

  // ฟังก์ชันแสดงผลเวลา deadline ในรูปแบบที่เหมาะสม
  const formatDeadlineTime = () => {
    if (bookingData && bookingData.deadline) {
      try {
        // แปลง deadline string จาก ISO format ให้เป็น Date object
        const deadlineDate = new Date(bookingData.deadline);
        console.log("Formatting deadline:", deadlineDate);

        // ฟอร์แมตเวลาเป็นรูปแบบของไทย
        const options = {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        };

        // ใช้ Intl.DateTimeFormat เพื่อแปลงเวลาให้เป็นรูปแบบของไทย
        const formattedTime = new Intl.DateTimeFormat('th-TH', options).format(deadlineDate) + ' น.';
        console.log("Formatted deadline time:", formattedTime);
        return formattedTime;
      } catch (error) {
        console.error('Error formatting deadline:', error);
        return "";
      }
    }
    return "";
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
                กรุณาชำระเงิน {bookingData && bookingData.amount ? bookingData.amount : total} บาท
              </DialogTitle>
              <DialogDescription className="text-sm text-black">
                ชื่อบัญชี: บริษัท DogGo Thailand
              </DialogDescription>
              <DialogDescription className="text-md text-black">
                โปรดชำระเงินภายในเวลา {formatDeadlineTime()}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center text-2xl font-bold">
              เหลือเวลา {formatTime(timeLeft)}
            </div>
            <DialogFooter className="sm:justify-center">
              <Button
                  onClick={handleConfirmClick}
                  disabled={isConfirmingPayment}
              >
                {isConfirmingPayment ? "กำลังยืนยัน..." : "ยืนยันการชำระเงิน"}
              </Button>
              <Button
                  variant="destructive"
                  onClick={() => {
                    console.log("Cancel booking button clicked");
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
                    setDialogTitle("ยกเลิกการจอง");
                    setMessage("การจองของท่านถูกยกเลิกเรียบร้อยแล้ว ขอบคุณที่แจ้งให้เราทราบ");
                    setShowErrorDialog(true);
                  }}
              >
                ยกเลิกการจอง
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success & Error Confirmation Dialogs */}
        <ConfirmationDialogs
            showSuccessDialog={showSuccessDialog}
            showErrorDialog={showErrorDialog}
            message={message}
            title={dialogTitle} // ส่งหัวข้อ dialog ไปยัง ConfirmationDialogs
            onSuccessClose={handleSuccessDialogClose}
            onErrorClose={handleErrorDialogClose}
        />
      </>
  );
};

export default PaymentTimer;