"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PaymentTimerUI from "@/components/payment-timer";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loading from "@/components/loading";
import useBilling from "@/hooks/useBiiling";

export default function Billing() {
  const {
    info,
    paymentInfo,
    showInvalidDataDialog,
    isLoading,
    formattedDate,
    handleCancel,
    handleInvalidDataClose,
    setShowInvalidDataDialog
  } = useBilling();

  // เพิ่ม state สำหรับจัดการปุ่มชำระเงิน
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [walkingServiceData, setWalkingServiceData] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // ฟังก์ชันสำหรับการชำระเงิน
  const handlePaymentClick = async () => {
    setIsPaymentLoading(true);

    try {
      // ตรวจสอบความถูกต้องของข้อมูลการจอง
      if (!paymentInfo ||
          !paymentInfo.dogWalkerId ||
          !paymentInfo.startTimeInt ||
          !paymentInfo.endTimeInt ||
          !paymentInfo.date ||
          !Array.isArray(paymentInfo.dogIds) ||
          paymentInfo.dogIds.length === 0) {

        alert("ข้อมูลการจองไม่ครบถ้วน กรุณาตรวจสอบและทำรายการใหม่อีกครั้ง");
        setIsPaymentLoading(false);
        return;
      }

      const response = await fetch('/api/user/booking-dw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentInfo),
      });

      const data = await response.json();

      if (response.ok) {
        // บันทึกข้อมูลการจองและแสดง PaymentTimerUI
        const bookingResult = {
          dogWalkerId: paymentInfo.dogWalkerId,
          date: paymentInfo.date,
          startTime: paymentInfo.startTimeInt,
          endTime: paymentInfo.endTimeInt,
          dogIds: paymentInfo.dogIds,
          dogNames: paymentInfo.dogNames || [],
          walkingServiceId: data.walkingServiceId,
          billingId: data.billingId,
          total: data.amount || info.total,
          dwName: paymentInfo.dogWalkerName,
          bookingTimestamp: new Date().toISOString(),
          deadline: data.deadline
        };

        localStorage.setItem('lastBookingResult', JSON.stringify(bookingResult));

        // ส่งข้อมูลไปให้ PaymentTimerUI
        setWalkingServiceData({
          walkingServiceId: data.walkingServiceId,
          billingId: data.billingId,
          amount: data.amount || info.total,
          deadline: data.deadline
        });

        // เริ่มแสดง PaymentTimerUI พร้อมกับข้อมูลที่จำเป็น
        setShowPaymentDialog(true);
      } else {
        if (data.altFlow) {
          alert("ขออภัย Dog Walker ท่านนี้มีการจองในช่วงเวลาที่ท่านเลือกแล้ว กรุณาเลือกช่วงเวลาอื่น หรือพนักงานท่านอื่น");
        } else {
          alert(`ขออภัย เกิดข้อผิดพลาดในการจอง: ${data.error || 'กรุณาลองใหม่อีกครั้งในภายหลัง'}`);
        }
      }
    } catch (error) {
      alert("ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ กรุณาลองใหม่อีกครั้งในภายหลัง");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
      <div className="p-4 space-y-4">
        {/* Dialog แจ้งเตือนกรณีข้อมูลไม่ถูกต้อง */}
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
                  <div className="flex space-x-2">
                    <span className="font-bold">จำนวนเงิน:</span>
                    <span>{info.total}</span>
                    <span>บาท</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Button Section (Pinned at Bottom) */}
            <div className="flex flex-row space-x-4 justify-center">
              <Button
                  variant="default"
                  onClick={handlePaymentClick}
                  disabled={isPaymentLoading}
              >
                {isPaymentLoading ? "กำลังดำเนินการ..." : "ชำระเงิน"}
              </Button>
              <Button variant="destructive" onClick={handleCancel}>ยกเลิก</Button>
            </div>
          </Card>
        </div>

        {/* PaymentTimerUI ถูกย้ายออกมานอก Card โดยมีเงื่อนไขแสดงเมื่อมีข้อมูล */}
        {walkingServiceData && (
            <PaymentTimerUI
                walkingServiceId={walkingServiceData.walkingServiceId}
                showPaymentDialog={showPaymentDialog}
                setShowPaymentDialog={setShowPaymentDialog}
            />
        )}
      </div>
  );
}