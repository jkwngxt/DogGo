"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ConfirmationDialogs from "./confirmation-dialogs";
const PaymentTimerUI = ({ walkingServiceId, showPaymentDialog, setShowPaymentDialog }) => {
  const router = useRouter();

  // State สำหรับข้อมูลการชำระเงิน
  const [paymentDetails, setPaymentDetails] = useState(null);

  // สถานะ dialogs
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // สถานะเนื้อหา dialogs
  const [message, setMessage] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");

  // สถานะการทำงาน
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [timeLeft, setTimeLeft] = useState(999999);

  // Reference สำหรับ timer
  const timerRef = useRef(null);

  // ฟังก์ชันล้างข้อมูล session
  const clearSessionData = useCallback(() => {
    sessionStorage.removeItem('bookingData');
    sessionStorage.removeItem('selectedDogWalker');
    sessionStorage.removeItem('walkingServiceSearch');
  }, []);

  // ฟังก์ชันยกเลิกการจอง
  const cancelBooking = useCallback(async (wsId) => {
    try {
      const response = await fetch('/api/walking-service/change-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "status": 210, // Cancelled status code
          "walkingServiceId": wsId,
        }),
      });
      return response.ok;
    } catch (error) {
      console.error("Error cancelling booking:", error);
      return false;
    }
  }, []);

  // ดึงข้อมูลการชำระเงินจาก API
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!walkingServiceId || !showPaymentDialog) return;

      setIsLoadingData(true);

      try {
        // เรียก API เพื่อดึงข้อมูลการชำระเงิน
        const response = await fetch('/api/walking-service/payment-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ walkingServiceId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch payment details');
        }

        const data = await response.json();
        setPaymentDetails(data);
      } catch (error) {
        console.error('Error fetching payment details:', error);
        setDialogTitle("เกิดข้อผิดพลาด");
        setMessage("ไม่สามารถดึงข้อมูลการชำระเงินได้ กรุณาลองใหม่อีกครั้ง");
        setShowErrorDialog(true);
        setShowPaymentDialog(false);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchPaymentDetails();
  }, [walkingServiceId, showPaymentDialog]);

  // ตัวจับเวลา countdown
  useEffect(() => {
    if (showPaymentDialog && !timerRef.current && paymentDetails?.deadline) {
      const updateTimeLeft = () => {
        try {
          if (!paymentDetails.deadline) {
            console.warn('No deadline available');
            return;
          }

          const deadlineTime = new Date(paymentDetails.deadline).getTime();
          const currentTime = new Date().getTime();
          const diffMs = deadlineTime - currentTime;
          const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));

          setTimeLeft(diffSeconds);

          if (diffSeconds <= 0) {
            console.warn('Time expired - clearing timer');
            clearInterval(timerRef.current);
            timerRef.current = null;
            handleTimeExpired();
          }
        } catch (error) {
          console.error('Error calculating time left:', error);
          setTimeLeft(0);
        }
      };

      updateTimeLeft();
      timerRef.current = setInterval(updateTimeLeft, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [showPaymentDialog, paymentDetails]);

  // จัดการกรณีหมดเวลา
  const handleTimeExpired = useCallback(() => {
    setShowPaymentDialog(false);

    if (walkingServiceId) {
      cancelBooking(walkingServiceId);
    }

    // อัปเดตสถานะการจองใน localStorage
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

    clearSessionData();

    // แสดง dialog แจ้งเตือน
    setDialogTitle("เวลาชำระเงินหมดลง");
    setMessage("ขออภัย เวลาในการชำระเงินได้หมดลงแล้ว การจองของท่านถูกยกเลิกโดยอัตโนมัติ กรุณาทำรายการใหม่อีกครั้ง");
    setShowErrorDialog(true);
  }, [walkingServiceId, cancelBooking, clearSessionData, setShowPaymentDialog]);

  // ฟังก์ชันยืนยันการชำระเงิน
  const handleConfirmClick = useCallback(async () => {
    if (!paymentDetails?.billingId) {
      setDialogTitle("ข้อมูลไม่ถูกต้อง");
      setMessage("ขออภัย ข้อมูลการชำระเงินไม่ถูกต้อง กรุณาทำรายการใหม่อีกครั้ง");
      setShowErrorDialog(true);
      setShowPaymentDialog(false);
      return;
    }

    setIsConfirmingPayment(true);

    try {
      const paymentConfirmation = {
        billingId: paymentDetails.billingId,
        amount: paymentDetails.amount,
        confirmed: true
      };

      const response = await fetch('/api/walking-service/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentConfirmation),
      });

      const data = await response.json();

      if (response.ok) {
        setShowPaymentDialog(false);
        setDialogTitle("ชำระเงินสำเร็จ");
        setMessage("การชำระเงินสำเร็จเรียบร้อยแล้ว ขณะนี้อยู่ระหว่างการยืนยันจาก Dog Walker ขอบคุณที่ใช้บริการของเรา");
        setShowSuccessDialog(true);
      } else {
        setShowPaymentDialog(false);
        setDialogTitle("ชำระเงินไม่สำเร็จ");
        setMessage("ขออภัย ไม่สามารถยืนยันการชำระเงินได้ในขณะนี้ กรุณาลองใหม่อีกครั้งในภายหลัง");

        if (walkingServiceId) {
          await cancelBooking(walkingServiceId);
        }

        setShowErrorDialog(true);
      }
    } catch (error) {
      setShowPaymentDialog(false);
      setDialogTitle("เกิดข้อผิดพลาด");
      setMessage("ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบชำระเงิน กรุณาลองใหม่อีกครั้งในภายหลัง");

      if (walkingServiceId) {
        await cancelBooking(walkingServiceId);
      }

      setShowErrorDialog(true);
    } finally {
      setIsConfirmingPayment(false);
    }
  }, [paymentDetails, walkingServiceId, cancelBooking, setShowPaymentDialog]);

  // ฟังก์ชันยกเลิกการจอง
  const handleCancelBooking = useCallback(() => {
    if (walkingServiceId) {
      cancelBooking(walkingServiceId);
    }

    clearSessionData();

    setShowPaymentDialog(false);
    setDialogTitle("ยกเลิกการจอง");
    setMessage("การชำระเงินถูกยกเลิก และระบบได้ยกเลิกการจองของท่านเรียบร้อยแล้ว ขอบคุณที่ใช้บริการ");
    setShowErrorDialog(true);
  }, [walkingServiceId, cancelBooking, clearSessionData, setShowPaymentDialog]);

  // ฟังก์ชันปิด dialogs
  const handleErrorDialogClose = useCallback(() => {
    setShowErrorDialog(false);
    clearSessionData();
    router.push("/pet-owner/homepage");
  }, [clearSessionData, router]);

  const handleSuccessDialogClose = useCallback(() => {
    setShowSuccessDialog(false);
    router.push("/pet-owner/homepage");
  }, [router]);

  // ฟังก์ชันฟอร์แมตเวลา
  const formatTime = useCallback((seconds) => {
    if (seconds <= 0) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const formatDeadlineTime = useCallback(() => {
    if (!paymentDetails?.deadline) return "";

    try {
      const deadlineDate = new Date(paymentDetails.deadline);
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };

      return new Intl.DateTimeFormat('th-TH', options).format(deadlineDate) + ' น.';
    } catch (error) {
      console.error('Error formatting deadline:', error);
      return "";
    }
  }, [paymentDetails]);

  // ฟอร์แมตวันที่แบบไทย
  const formatThaiDate = useCallback((dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };

      return new Intl.DateTimeFormat('th-TH', options).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return "";
    }
  }, []);

  // ฟอร์แมตเวลาการจอง
  const formatBookingTimes = useCallback(() => {
    if (!paymentDetails?.time || !Array.isArray(paymentDetails.time) || paymentDetails.time.length === 0) return "";

    try {
      const timeArray = paymentDetails.time.sort((a, b) => a - b);
      const startTime = timeArray[0];
      const endTime = timeArray[timeArray.length - 1] + 1;

      return `${startTime}:00 - ${endTime}:00`;
    } catch (error) {
      console.error('Error formatting booking times:', error);
      return "";
    }
  }, [paymentDetails]);

  return (
      <>
        {/* Payment Dialog with QR Code */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogTitle />
          <DialogContent className="sm:max-w-md flex flex-col items-center">
            {isLoadingData ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
                  <p className="mt-4">กำลังโหลดข้อมูลการชำระเงิน...</p>
                </div>
            ) : (
                <>
                  <img
                      src="/image/payment-qr-crop.png"
                      alt="qr-code"
                  />
                  <DialogHeader className="flex items-center">
                    <DialogTitle>
                      กรุณาชำระเงิน {paymentDetails ? paymentDetails.amount : 0} บาท
                    </DialogTitle>
                    <DialogDescription className="text-sm text-black">
                      ชื่อบัญชี: บริษัท DogGo Thailand
                    </DialogDescription>
                    <DialogDescription className="text-md text-black">
                      โปรดชำระเงินภายในเวลา {formatDeadlineTime()}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex justify-center text-2xl font-bold mt-4">
                    เหลือเวลา {formatTime(timeLeft)}
                  </div>
                  <DialogFooter className="sm:justify-center">
                    <Button
                        className={"w-32"}
                        onClick={handleConfirmClick}
                        disabled={isConfirmingPayment}
                    >
                      {isConfirmingPayment ? "กำลังยืนยัน..." : "ยืนยันการชำระเงิน"}
                    </Button>
                    <Button
                        variant="destructive"
                        className={"w-32"}
                        onClick={handleCancelBooking}
                    >
                      ยกเลิกการจอง
                    </Button>
                  </DialogFooter>
                </>
            )}
          </DialogContent>
        </Dialog>

        {/* Success & Error Confirmation Dialogs */}
        <ConfirmationDialogs
            showSuccessDialog={showSuccessDialog}
            showErrorDialog={showErrorDialog}
            message={message}
            title={dialogTitle}
            onSuccessClose={handleSuccessDialogClose}
            onErrorClose={handleErrorDialogClose}
        />
      </>
  );
};

export default PaymentTimerUI;