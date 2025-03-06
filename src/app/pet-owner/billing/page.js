"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PaymentTimer from "@/components/payment-timer";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loading from "@/components/loading";

export default function Billing() {
  const router = useRouter();
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

  // เพิ่มข้อมูลสำหรับส่งให้ PaymentTimer
  const [paymentInfo, setPaymentInfo] = useState(null);

  const [showInvalidDataDialog, setShowInvalidDataDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Protect from direct URL access - secure session check
    const validateSession = () => {
      try {
        // Check for valid walkingServiceSearch session data
        const searchDataStr = sessionStorage.getItem('walkingServiceSearch');
        if (!searchDataStr) return false;

        // Check for valid bookingData session data
        const bookingDataStr = sessionStorage.getItem('bookingData');
        if (!bookingDataStr) return false;

        const bookingData = JSON.parse(bookingDataStr);
        const searchData = JSON.parse(searchDataStr);

        // Validate that booking data matches search data
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

    // ดึงข้อมูลจาก sessionStorage แทนการใช้ URL parameters
    const loadBookingData = () => {
      const bookingDataStr = sessionStorage.getItem('bookingData');
      const searchDataStr = sessionStorage.getItem('walkingServiceSearch');

      if (!bookingDataStr || !validateSession()) {
        // ถ้าไม่มีข้อมูลใน sessionStorage หรือข้อมูลไม่ตรงกัน แสดงว่าผู้ใช้อาจเข้ามาโดยตรง
        setShowInvalidDataDialog(true);
        setIsLoading(false);
        return false;
      }

      try {
        const bookingData = JSON.parse(bookingDataStr);
        const searchData = searchDataStr ? JSON.parse(searchDataStr) : null;

        // ตรวจสอบว่าข้อมูลครบถ้วนและถูกต้องหรือไม่
        if (!bookingData.dwId || !bookingData.startTime || !bookingData.endTime ||
            !bookingData.date || !Array.isArray(bookingData.dogIds) || bookingData.dogIds.length === 0 ||
            !Array.isArray(bookingData.dogNames) || bookingData.dogNames.length === 0) {
          console.error('Invalid booking data structure');
          setShowInvalidDataDialog(true);
          setIsLoading(false);
          return false;
        }

        // Calculate total if not present (250 per hour per dog)
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

        // Format start and end times to display as HH:00
        const formattedStartTime = bookingData.startTime ? `${bookingData.startTime}:00` : "";
        const formattedEndTime = bookingData.endTime ? `${bookingData.endTime}:00` : "";

        // Update state with the retrieved information
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

        // เตรียมข้อมูลสำหรับส่งให้ PaymentTimer
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const formattedDate = formatDate(info.ws_date);

  const handleCancel = () => {
    // ล้างข้อมูลใน sessionStorage เมื่อยกเลิก
    sessionStorage.removeItem('bookingData');

    try {
      // Go back to previous page if history exists
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/pet-owner/walking-service");
      }
    } catch (error) {
      // Fallback to home page
      window.location.href = "/pet-owner/walking-service";
    }
  };

  // ฟังก์ชันสำหรับจัดการกรณีข้อมูลไม่ถูกต้อง
  const handleInvalidDataClose = () => {
    // ลบข้อมูลใน sessionStorage
    sessionStorage.removeItem('bookingData');
    // นำผู้ใช้กลับไปหน้า home
    router.push('/pet-owner/walking-service');
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
      <div className="p-4 space-y-4">
        {/* Dialog สำหรับแจ้งเตือนกรณีข้อมูลไม่ถูกต้อง */}
        <Dialog open={showInvalidDataDialog} onOpenChange={setShowInvalidDataDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>ข้อมูลการจองไม่ถูกต้อง</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              กรุณาทำรายการใหม่อีกครั้ง
            </div>
            <DialogFooter>
              <Button onClick={handleInvalidDataClose}>
                ตกลง
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex flex-col px-10 items-center">
          <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
            รายละเอียดการชำระเงิน
          </h1>
          <Card className="w-[100%] sm:w-[60%] md:w-[60%] lg:w-[80%] p-6 py-10 h-[70vh] flex flex-col justify-between">
            {/* Content Section */}
            <div className="flex-grow flex flex-col space-y-4 items-center">
              <div className="space-y-4 w-[60%] text-left">
                <h1 className="flex text-3xl font-bold">รายละเอียดการจอง</h1>
              </div>
              <div className="flex justify-between w-[60%]">
                <div className="space-y-6">
                  <div className="flex space-x-2">
                    <span className="font-bold">ชื่อพนักงาน:</span>
                    <span>{info.dw_username}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="font-bold">วันที่และเวลาที่จอง:</span>
                    <div className="flex-row space-x-1">
                      <span>{formattedDate}</span>
                      <span>{info.startTime}</span>
                      <span>-</span>
                      <span>{info.endTime}</span>
                    </div>
                  </div>
                  <div className="flex-row space-x-2">
                    <span className="font-bold">รายการสุนัข:</span>
                    {info.dogs.map((dog, index) => (
                        <span key={index}>
                      {dog}
                          {index < info.dogs.length - 1 ? ", " : ""}
                    </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <span className="font-bold">เบอร์โทรติดต่อ:</span>
                    <span>{info.dw_tel}</span>
                  </div>
                  <div className="flex-row space-x-2">
                    <span className="font-bold">จำนวนเงิน:</span>
                    <span>{info.total}</span>
                    <span>บาท</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Button Section (Pinned at Bottom) */}
            <div className="flex flex-row space-x-4 justify-center">
              {paymentInfo && (
                  <PaymentTimer
                      total={info.total}
                      bookingInfo={paymentInfo}
                  />
              )}
              <Button variant="destructive" onClick={handleCancel}>ยกเลิก</Button>
            </div>
          </Card>
        </div>
      </div>
  );
}