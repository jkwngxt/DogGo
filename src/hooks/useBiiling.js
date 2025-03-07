"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const useBilling = () => {
    const router = useRouter();

    // State ข้อมูลหลักของการชำระเงิน
    const [info, setInfo] = useState({
        userImage: "/image/user-placeholder.jpg",
        dw_username: "",
        ws_date: "",
        startTime: "",
        endTime: "",
        dw_tel: "",
        total: 0,
        dogs: [],
    });

    // ข้อมูลสำหรับส่งให้ PaymentTimerUI
    const [paymentInfo, setPaymentInfo] = useState(null);

    const [showInvalidDataDialog, setShowInvalidDataDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // ตรวจสอบความถูกต้องของ session
        const validateSession = () => {
            try {
                const searchDataStr = sessionStorage.getItem('walkingServiceSearch');
                if (!searchDataStr) return false;

                const bookingDataStr = sessionStorage.getItem('bookingData');
                if (!bookingDataStr) return false;

                const bookingData = JSON.parse(bookingDataStr);
                const searchData = JSON.parse(searchDataStr);

                return (
                    bookingData.date === searchData.date &&
                    bookingData.startTime === searchData.startTimeInt &&
                    bookingData.endTime === searchData.endTimeInt
                );
            } catch (error) {
                console.error('Error validating session data:', error);
                return false;
            }
        };

        // โหลดข้อมูลการจองจาก sessionStorage
        const loadBookingData = () => {
            const bookingDataStr = sessionStorage.getItem('bookingData');
            const searchDataStr = sessionStorage.getItem('walkingServiceSearch');

            if (!bookingDataStr || !validateSession()) {
                setShowInvalidDataDialog(true);
                setIsLoading(false);
                return false;
            }

            try {
                const bookingData = JSON.parse(bookingDataStr);

                // ตรวจสอบความถูกต้องของข้อมูล
                if (!bookingData.dwId || !bookingData.startTime || !bookingData.endTime ||
                    !bookingData.date || !Array.isArray(bookingData.dogIds) || bookingData.dogIds.length === 0 ||
                    !Array.isArray(bookingData.dogNames) || bookingData.dogNames.length === 0) {
                    console.error('Invalid booking data structure');
                    setShowInvalidDataDialog(true);
                    setIsLoading(false);
                    return false;
                }

                // คำนวณราคารวม
                let total = bookingData.totalPrice;
                if (!total) {
                    const hours = bookingData.startTime && bookingData.endTime
                        ? (parseInt(bookingData.endTime) - parseInt(bookingData.startTime))
                        : 0;

                    if (hours <= 0) {
                        console.error('Invalid time range');
                        setShowInvalidDataDialog(true);
                        setIsLoading(false);
                        return false;
                    }

                    total = hours * 250 * bookingData.dogIds.length;
                }

                // ฟอร์แมตเวลาให้แสดงเป็น HH:00
                const formattedStartTime = bookingData.startTime ? `${bookingData.startTime}:00` : "";
                const formattedEndTime = bookingData.endTime ? `${bookingData.endTime}:00` : "";

                // อัพเดท state ด้วยข้อมูลที่ได้รับ
                setInfo({
                    userImage: "/image/user-placeholder.jpg",
                    dw_username: bookingData.dwName || "",
                    ws_date: bookingData.date || "",
                    startTime: formattedStartTime,
                    endTime: formattedEndTime,
                    dw_tel: bookingData.dwTel || "",
                    total: total,
                    dogs: bookingData.dogNames || [],
                });

                // เตรียมข้อมูลสำหรับส่งให้ PaymentTimerUI
                setPaymentInfo({
                    dogWalkerId: parseInt(bookingData.dwId),
                    date: bookingData.date,
                    startTimeInt: parseInt(bookingData.startTime),
                    endTimeInt: parseInt(bookingData.endTime),
                    dogIds: bookingData.dogIds,
                    price: total,
                    dogWalkerName: bookingData.dwName,
                    dogNames: bookingData.dogNames
                });

                setIsLoading(false);
                return true;
            } catch (error) {
                console.error('Error parsing booking data:', error);
                setShowInvalidDataDialog(true);
                setIsLoading(false);
                return false;
            }
        };

        loadBookingData();
    }, [router]);

    // ฟอร์แมตวันที่เป็น dd/mm/yyyy
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    };

    const formattedDate = formatDate(info.ws_date);

    // ฟังก์ชันยกเลิกการจอง
    const handleCancel = () => {
        sessionStorage.removeItem('bookingData');

        try {
            if (window.history.length > 1) {
                router.back();
            } else {
                router.push("/pet-owner/walking-service");
            }
        } catch (error) {
            window.location.href = "/pet-owner/walking-service";
        }
    };

    // ฟังก์ชันจัดการกรณีข้อมูลไม่ถูกต้อง
    const handleInvalidDataClose = () => {
        sessionStorage.removeItem('bookingData');
        router.push('/pet-owner/walking-service');
    };

    return {
        // State values
        info,
        paymentInfo,
        showInvalidDataDialog,
        isLoading,
        formattedDate,

        // Functions
        handleCancel,
        handleInvalidDataClose,
        setShowInvalidDataDialog
    };
};

export default useBilling;