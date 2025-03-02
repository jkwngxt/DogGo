"use client";

import React, { useState } from "react";
import HomeDogWalker from "@/components/home-dog-walker";
import DateTimeRangePicker from "@/components/select-datetime";
import { Button } from "@/components/ui/button";
import ConfirmationDialogs from "@/components/confirmation-dialogs";

export default function WalkingService() {
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [message, setMessage] = useState("");

  const handleSearch = () => {
    console.log("Selected Date:", startDate);
    console.log("Start Time:", startTime);
    console.log("End Time:", endTime);

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const startHour = parseInt(startTime.split(":")[0], 10);
    const endHour = parseInt(endTime.split(":")[0], 10);

    // Check if date is tomorrow or further
    // Check if start time is before end time
    if (startDate < tomorrow) {
      setMessage("เวลาไม่ถูกต้อง")
      setShowErrorDialog(true);
      return;
    }

    if (startHour >= endHour) {
      setMessage("เวลาไม่ถูกต้อง")
      setShowErrorDialog(true);
      return;
    }

    if (false) {
      setMessage("ไม่มี Dog Walker ที่พร้อมให้บริการ")
      setShowErrorDialog(true);
      return;
    }
  };

  const handleDialogClose = () => { setShowErrorDialog(false); }

  const dogWalkers = [
    {
      userImage: "/image/user-placeholder.jpg",
      dw_username: "John Doe",
      dw_zone: "New York, NY",
      dw_tel: "(555) 123-4567",
      rating: "4.8",
    },
    {
      userImage: "/image/user-placeholder.jpg",
      dw_username: "Jane Smith",
      dw_zone: "Los Angeles, CA",
      dw_tel: "(555) 987-6543",
      rating: "4.9",
    },
    {
      userImage: "/image/user-placeholder.jpg",
      dw_username: "Jake Wilson",
      dw_zone: "Chicago, IL",
      dw_tel: "(555) 111-2222",
      rating: "4.7",
    },
  ];
  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <div className="w-9/12 p-6 h-auto space-y-4 ">
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
              <Button variant="secondary" onClick={handleSearch}>
                ค้นหา
              </Button>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
            รายการ Dog Walker
          </h1>
          {dogWalkers.map((walker, index) => (
            <HomeDogWalker
              key={index}
              userImage={walker.userImage}
              dw_username={walker.dw_username}
              dw_zone={walker.dw_zone}
              dw_tel={walker.dw_tel}
              rating={walker.rating}
            />
          ))}
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
