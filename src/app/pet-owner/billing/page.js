"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PaymentTimer from "@/components/payment-timer";
import { useSearchParams, useRouter } from "next/navigation";

export default function Billing() {
  const searchParams = useSearchParams();
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

  useEffect(() => {
    // Get data from URL parameters
    const dwId = searchParams.get('dwId');
    const dwName = searchParams.get('dwName');
    const dwTel = searchParams.get('dwTel');
    const date = searchParams.get('date');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    const dogsParam = searchParams.get('dogs');

    // Parse dogs JSON array
    let dogsList = [];
    try {
      if (dogsParam) {
        dogsList = JSON.parse(dogsParam);
      }
    } catch (error) {
      console.error('Error parsing dogs data:', error);
    }

    // Calculate total (250 per hour per dog)
    const hours = startTime && endTime ? (parseInt(endTime) - parseInt(startTime)) : 0;
    const total = hours * 250 * dogsList.length;

    // Format start and end times to display as HH:00
    const formattedStartTime = startTime ? `${startTime}:00` : "";
    const formattedEndTime = endTime ? `${endTime}:00` : "";

    // Update state with the retrieved information
    setInfo({
      userImage: "/image/user-placeholder.jpg",
      dw_username: dwName || "",
      ws_date: date || "",
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      dw_tel: dwTel || "",
      total: total,
      dogs: dogsList,
    });
  }, [searchParams]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const formattedDate = formatDate(info.ws_date);

  const handleCancel = () => {
    try {
      // Go back to previous page if history exists
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/");
      }
    } catch (error) {
      // Fallback to home page
      window.location.href = "/";
    }
  };

  return (
      <div className="p-4 space-y-4">
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
              <PaymentTimer total={info.total} />
              <Button variant="destructive" onClick={handleCancel}>ยกเลิก</Button>
            </div>
          </Card>
        </div>
      </div>
  );
}