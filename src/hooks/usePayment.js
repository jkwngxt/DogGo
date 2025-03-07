"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

export const usePayment = ({ total, bookingInfo }) => {
    const router = useRouter();

    // Dialog states
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);

    // Dialog content states
    const [message, setMessage] = useState("");
    const [dialogTitle, setDialogTitle] = useState("");

    // Loading and payment states
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

    // Booking data and timer states
    const [bookingData, setBookingData] = useState(null);
    const [timeLeft, setTimeLeft] = useState(999999);
    const timerRef = useRef(null);

    const cancelBooking = useCallback(async (walkingServiceId) => {
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
    }, []);

    const clearSessionData = useCallback(() => {
        sessionStorage.removeItem('bookingData');
        sessionStorage.removeItem('selectedDogWalker');
        sessionStorage.removeItem('walkingServiceSearch');
    }, []);

    useEffect(() => {
        if (showPaymentDialog && !timerRef.current && bookingData?.deadline) {
            const updateTimeLeft = () => {
                try {
                    if (!bookingData.deadline) {
                        console.warn('No deadline available');
                        return;
                    }

                    const deadlineTime = new Date(bookingData.deadline).getTime();
                    const currentTime = new Date().getTime();
                    const diffMs = deadlineTime - currentTime;
                    const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));

                    setTimeLeft(diffSeconds);

                    if (diffSeconds <= 0) {
                        console.warn('Time expired - clearing timer');
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                        clearSessionData();
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
    }, [showPaymentDialog, bookingData, clearSessionData]);

    useEffect(() => {
        if (timeLeft === 0 && showPaymentDialog) {
            setShowPaymentDialog(false);

            if (bookingData?.walkingServiceId) {
                cancelBooking(bookingData.walkingServiceId);
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
        }
    }, [timeLeft, showPaymentDialog, bookingData, cancelBooking, clearSessionData]);

    const handleConfirmClick = useCallback(async () => {
        if (!bookingData?.billingId) {
            setDialogTitle("ข้อมูลไม่ถูกต้อง");
            setMessage("ขออภัย ข้อมูลการชำระเงินไม่ถูกต้อง กรุณาทำรายการใหม่อีกครั้ง");
            setShowErrorDialog(true);
            setShowPaymentDialog(false);
            return;
        }

        setIsConfirmingPayment(true);

        try {
            const paymentAmount = bookingData.amount || total;
            const paymentConfirmation = {
                userId: null,
                billingId: bookingData.billingId,
                amount: paymentAmount,
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

                if (bookingData?.walkingServiceId) {
                    await cancelBooking(bookingData.walkingServiceId);
                }

                setShowErrorDialog(true);
            }
        } catch (error) {
            setShowPaymentDialog(false);
            setDialogTitle("เกิดข้อผิดพลาด");
            setMessage("ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบชำระเงิน กรุณาลองใหม่อีกครั้งในภายหลัง");

            if (bookingData?.walkingServiceId) {
                await cancelBooking(bookingData.walkingServiceId);
            }

            setShowErrorDialog(true);
        } finally {
            setIsConfirmingPayment(false);
        }
    }, [bookingData, total, cancelBooking]);

    const handleErrorDialogClose = useCallback(() => {
        setShowErrorDialog(false);
        clearSessionData();
        router.push("/pet-owner/walking-service");
    }, [clearSessionData, router]);

    const handleSuccessDialogClose = useCallback(() => {
        setShowSuccessDialog(false);
        router.push(`/pet-owner/walking-service`);
    }, [router, bookingInfo.dogWalkerId]);

    const handleCancelBooking = useCallback(() => {
        if (bookingData?.walkingServiceId) {
            cancelBooking(bookingData.walkingServiceId);
        }

        clearSessionData();

        setShowPaymentDialog(false);
        setDialogTitle("ยกเลิกการจอง");
        setMessage("การชำระเงินถูกยกเลิก และระบบได้ยกเลิกการจองของท่านเรียบร้อยแล้ว ขอบคุณที่ใช้บริการ");
        setShowErrorDialog(true);
    }, [bookingData, cancelBooking, clearSessionData]);

    const formatTime = useCallback((seconds) => {
        if (seconds <= 0) {
            return "0:00";
        }

        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }, []);

    const formatDeadlineTime = useCallback(() => {
        if (!bookingData?.deadline) return "";

        try {
            const deadlineDate = new Date(bookingData.deadline);
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
    }, [bookingData]);

    return {
        // State variables
        showPaymentDialog,
        showSuccessDialog,
        showErrorDialog,
        message,
        dialogTitle,
        isLoading,
        isConfirmingPayment,
        bookingData,
        timeLeft,

        // Formatting functions
        formatTime,
        formatDeadlineTime,

        // Action handlers
        handlePaymentClick,
        handleConfirmClick,
        handleCancelBooking,
        handleErrorDialogClose,
        handleSuccessDialogClose,
        setShowPaymentDialog,
        setShowErrorDialog,
        setShowSuccessDialog
    };
};

export default usePayment;