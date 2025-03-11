"use client";

import React, { useState, useEffect } from "react";
import HomeDogWalker from "@/components/home-dog-walker";
import DateTimeRangePicker from "@/components/select-datetime";
import { Button } from "@/components/ui/button";
import ConfirmationDialogs from "@/components/confirmation-dialogs";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

export default function WalkingService() {
  const router = useRouter();
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [dogWalkers, setDogWalkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // คำนวณวันพรุ่งนี้สำหรับการตรวจสอบ
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  };

  const handleSearch = async () => {
    // ล้างผลลัพธ์การค้นหาก่อนหน้า
    setDogWalkers([]);

    // ตรวจสอบว่ามีการเลือกวันที่หรือไม่
    if (!startDate) {
      setMessage("กรุณาเลือกวันที่");
      setShowErrorDialog(true);
      return;
    }

    const tomorrow = getTomorrow();

    // แปลงเวลาเป็นตัวเลขสำหรับการเปรียบเทียบ
    const startHour = parseInt(startTime.split(":")[0], 10);
    const endHour = parseInt(endTime.split(":")[0], 10);

    // เช็คเงื่อนไขต่างๆ
    if (startDate < tomorrow) {
      setMessage("กรุณาเลือกวันที่ตั้งแต่พรุ่งนี้เป็นต้นไป");
      setShowErrorDialog(true);
      return;
    }

    if (startHour >= endHour) {
      setMessage("เวลาเริ่มต้นต้องก่อนเวลาสิ้นสุด");
      setShowErrorDialog(true);
      return;
    }

    // เริ่มการค้นหา
    setIsLoading(true);
    setSearchPerformed(true);

    try {
      // แก้ไขการจัดการวันที่เพื่อให้ถูกต้องตามโซนเวลาของไทย
      // สร้างวันที่ในรูปแบบ YYYY-MM-DD โดยใช้โซนเวลาท้องถิ่น (ไทย)
      const year = startDate.getFullYear();
      const month = String(startDate.getMonth() + 1).padStart(2, '0');
      const day = String(startDate.getDate()).padStart(2, '0');
      const searchDate = `${year}-${month}-${day}`;

      // ทดสอบแสดง ISO string แบบเดิมเพื่อเปรียบเทียบ
      startDate.toISOString().split('T')[0];
// บันทึกค่าการค้นหาลงใน sessionStorage
      const searchParams = {
        date: searchDate,
        startTimeInt: startHour,
        endTimeInt: endHour
      };

      sessionStorage.setItem('walkingServiceSearch', JSON.stringify(searchParams));

      // เรียก API เพื่อค้นหา Dog Walker
      const response = await fetch('/api/dog-walker/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      const result = await response.json();

      if (result.success) {
        if (result.dogWalkers && result.dogWalkers.length > 0) {
          setDogWalkers(result.dogWalkers);
        } else {
          setMessage("ไม่พบ Dog Walker ที่พร้อมให้บริการในช่วงเวลาและพื้นที่นี้");
          setShowErrorDialog(true);
        }
      } else {
        setMessage(result.message || "เกิดข้อผิดพลาดในการค้นหา Dog Walker");
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("Error searching for dog walkers:", error);
      setMessage("ไม่สามารถค้นหา Dog Walker ได้ กรุณาลองอีกครั้ง");
      setShowErrorDialog(true);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDialogClose = () => {
    setShowErrorDialog(false);
  };

  const handleSelectDogWalker = (dwId) => {
    // ดึงข้อมูลการค้นหาจาก sessionStorage
    const searchDataStr = sessionStorage.getItem('walkingServiceSearch');

    if (!searchDataStr) {
      setMessage("ไม่พบข้อมูลการค้นหา กรุณาค้นหาอีกครั้ง");
      setShowErrorDialog(true);
      return;
    }

    const searchData = JSON.parse(searchDataStr);

    // นำทางไปยังหน้ารายละเอียด Dog Walker พร้อมกับส่งพารามิเตอร์
    router.push(`/pet-owner/dog-walker/${dwId}?startTime=${searchData.startTimeInt}&endTime=${searchData.endTimeInt}&date=${searchData.date}`);
  };

  return (
      <div>
        <div className="flex flex-col justify-center items-center">
          <div className="w-9/12 p-6 h-auto space-y-4">
            <div className="flex flex-col px-10">
              <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
                โปรดเลือกวันที่และเวลา
              </h1>
              <div className="flex flex-row space-x-4">
                <DateTimeRangePicker
                    startDate={startDate}
                    setStartDate={setStartDate}
                    startTime={startTime}
                    setStartTime={setStartTime}
                    endTime={endTime}
                    setEndTime={setEndTime}
                />
                <Button variant="secondary" onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? "กำลังค้นหา..." : "ค้นหา"}
                </Button>
              </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center my-8">
                  <Loading wantBg={false} />
                </div>
            ) : searchPerformed && (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
                    รายการ Dog Walker
                  </h1>
                  {dogWalkers.length > 0 ? (
                      dogWalkers.map((walker, index) => (
                          <HomeDogWalker
                              key={index}
                              id={walker.id}
                              userImage={walker.pic || "/image/user-placeholder.jpg"}
                              dw_name={walker.name}
                              dw_zone={Array.isArray(walker.zone) ? walker.zone.join(', ') : walker.zone}
                              dw_tel={walker.tel}
                              rating={walker.meanRating?.toFixed(1) || "0.0"}
                              ratingCount={walker.ratingCount || 0}
                              onSelect={() => handleSelectDogWalker(walker.id)}
                          />
                      ))
                  ) : (
                      <p className="text-center text-gray-500 my-8">ไม่พบ Dog Walker ที่พร้อมให้บริการ</p>
                  )}
                </>
            )}
          </div>
        </div>

        <ConfirmationDialogs
            showErrorDialog={showErrorDialog}
            message={message}
            onErrorClose={handleDialogClose}
        />
      </div>
  );
}