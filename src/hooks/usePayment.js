"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Custom hook สำหรับการจัดการการชำระเงิน
 * @param {Object} options - ข้อมูลที่จำเป็นสำหรับการชำระเงิน
 * @param {number} options.total - จำนวนเงินทั้งหมด
 * @param {Object} options.bookingInfo - ข้อมูลการจอง
 * @returns {Object} - State และฟังก์ชันสำหรับการจัดการการชำระเงิน
 */
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

    // ฟังก์ชันคำนวณเวลา countdown
    useEffect(() => {
        if (showPaymentDialog && !timerRef.current && bookingData && bookingData.deadline) {

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
                        sessionStorage.removeItem('bookingData');
                        sessionStorage.removeItem('selectedDogWalker');
                        sessionStorage.removeItem('walkingServiceSearch');
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
    }, [showPaymentDialog, bookingData]);

    // ฟังก์ชันจัดการเมื่อเวลาหมด
    useEffect(() => {
        if (timeLeft === 0 && showPaymentDialog) {
            setShowPaymentDialog(false);

            if (bookingData && bookingData.walkingServiceId) {
                cancelBooking(bookingData.walkingServiceId);
            }

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

            setDialogTitle("เวลาชำระเงินหมดลง");
            setMessage("ขออภัย เวลาในการชำระเงินได้หมดลงแล้ว การจองของท่านถูกยกเลิกโดยอัตโนมัติ กรุณาทำรายการใหม่อีกครั้ง");
            setShowErrorDialog(true);
        }
    }, [timeLeft, showPaymentDialog, bookingData]);

    // ฟังก์ชันเริ่มกระบวนการชำระเงิน
    const handlePaymentClick = async () => {
        setIsLoading(true);

        try {
            if (!bookingInfo || !bookingInfo.dogWalkerId || !bookingInfo.startTimeInt ||
                !bookingInfo.endTimeInt || !bookingInfo.date ||
                !Array.isArray(bookingInfo.dogIds) || bookingInfo.dogIds.length === 0) {
                setDialogTitle("ข้อมูลไม่ครบถ้วน");
                setMessage("ขออภัย ข้อมูลการจองไม่ครบถ้วน กรุณาตรวจสอบและทำรายการใหม่อีกครั้ง");
                setShowErrorDialog(true);
                return;
            }

            const response = await fetch('/api/user/booking-dw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingInfo),
            });

            const data = await response.json();

            if (response.ok) {
                setBookingData({
                    billingId: data.billingId,
                    walkingServiceId: data.walkingServiceId,
                    amount: data.amount || total,
                    deadline: data.deadline
                });

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
            } else {
                if (data.altFlow) {
                    setDialogTitle("ช่วงเวลาไม่ว่าง");
                    setMessage(`ขออภัย Dog Walker ท่านนี้มีการจองในช่วงเวลาที่ท่านเลือกแล้ว กรุณาเลือกช่วงเวลาอื่น หรือพนักงานท่านอื่น`);
                } else {
                    setDialogTitle("เกิดข้อผิดพลาด");
                    setMessage(`ขออภัย เกิดข้อผิดพลาดในการจอง: ${data.error || 'กรุณาลองใหม่อีกครั้งในภายหลัง'}`);
                }
                setShowErrorDialog(true);
            }
        } catch (error) {
            setDialogTitle("เกิดข้อผิดพลาด");
            setMessage("ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ กรุณาลองใหม่อีกครั้งในภายหลัง");
            setShowErrorDialog(true);
        } finally {
            setIsLoading(false);
        }
    };

    // ฟังก์ชันยืนยันการชำระเงิน
    const handleConfirmClick = async () => {
        if (!bookingData || !bookingData.billingId) {
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

                if (bookingData && bookingData.walkingServiceId) {
                    await cancelBooking(bookingData.walkingServiceId);
                }

                setShowErrorDialog(true);
            }
        } catch (error) {
            setShowPaymentDialog(false);
            setDialogTitle("เกิดข้อผิดพลาด");
            setMessage("ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบชำระเงิน กรุณาลองใหม่อีกครั้งในภายหลัง");

            if (bookingData && bookingData.walkingServiceId) {
                await cancelBooking(bookingData.walkingServiceId);
            }

            setShowErrorDialog(true);
        } finally {
            setIsConfirmingPayment(false);
        }
    };

    // ฟังก์ชันยกเลิกการจอง
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

    // ฟังก์ชันจัดการปิด error dialog
    const handleErrorDialogClose = () => {
        setShowErrorDialog(false);
        sessionStorage.removeItem('bookingData');
        sessionStorage.removeItem('selectedDogWalker');
        sessionStorage.removeItem('walkingServiceSearch');
        router.push("/pet-owner/walking-service");
    };

    // ฟังก์ชันจัดการปิด success dialog
    const handleSuccessDialogClose = () => {
        setShowSuccessDialog(false);

        const bookingResultStr = localStorage.getItem('lastBookingResult');
        bookingResultStr ? JSON.parse(bookingResultStr) : null;

        router.push("/pet-owner/walking-service");
    };

    // ฟังก์ชันยกเลิกการจองโดยผู้ใช้
    const handleCancelBooking = () => {
        if (bookingData && bookingData.walkingServiceId) {
            cancelBooking(bookingData.walkingServiceId);
        }

        sessionStorage.removeItem('bookingData');
        sessionStorage.removeItem('selectedDogWalker');
        sessionStorage.removeItem('walkingServiceSearch');

        setShowPaymentDialog(false);
        setDialogTitle("ยกเลิกการจอง");
        setMessage("การจองของท่านถูกยกเลิกเรียบร้อยแล้ว ขอบคุณที่แจ้งให้เราทราบ");
        setShowErrorDialog(true);
    };

    // ฟังก์ชันฟอร์แมตเวลาเป็น MM:SS
    const formatTime = (seconds) => {
        if (seconds <= 0) {
            return "0:00";
        }

        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    // ฟังก์ชันฟอร์แมต deadline เป็นเวลาไทย
    const formatDeadlineTime = () => {
        if (bookingData && bookingData.deadline) {
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
        }
        return "";
    };

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