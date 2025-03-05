"use client";

import * as React from "react";
import { useRouter } from "next/navigation"; // Use next/router for navigation
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "./ui/button";
import OwnerWalkConfirmation from "./owner-walk-confirmation";

const HistoryDogWalker = ({
  userImage,
  dw_username,
  ws_date,
  timeRange,
  ws_status,
  isReviewed,
  walkingServiceId,
  onStatusUpdate
}) => {
  const router = useRouter();
  const [status, setStatus] = React.useState(ws_status);

  const handleCardClick = () => {
    router.push(`/dog-walker/walk-description/${walkingServiceId}`);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation(); // Prevents triggering card click event
    router.push("/pet-owner/review");
  };

  const handleStatusUpdate = (id, newStatus) => {
    setStatus(newStatus);
    if (onStatusUpdate) {
      onStatusUpdate(id, newStatus);
    }
  };

  const renderStatusButton = () => {
    switch (status) {
        case 202: // Awaiting Response
            return <p className="font-bold text-[#FFB000]">อยู่ระหว่างดำเนินการ</p>;

        case 210: // Cancelled
            return <p className="font-bold text-red-500">ยกเลิกบริการ</p>;

        case 220: // Rejected
            return <p className="font-bold text-red-500">การรับงานถูกปฏิเสธ</p>;

        case 203: // Accepted -> Show "ได้รับบริการ"
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <OwnerWalkConfirmation
              walkingServiceId={walkingServiceId}
              onStatusUpdate={() => handleStatusUpdate(walkingServiceId, 204)}
            />
          </div>
        );        

        case 204: // Completed
            return isReviewed ? (
                <p className="font-bold text-[#6498FA]">การบริการเสร็จสิ้น</p>
            ) : (
                <Button onClick={handleButtonClick} variant="secondary">
                    รีวิว
                </Button>
            );

        default:
            return <Button disabled variant="outline">กำลังอัปเดต...</Button>;
    }
};

  return (
    <Card className="max-w-full cursor-pointer" onClick={handleCardClick}>
      <CardHeader className="grid grid-cols-5 items-center gap-4">
      <div className="flex justify-center">
        <img
          src={userImage}
          alt="User profile"
          className="w-12 h-12 rounded-full object-cover"
        /></div>
        <div className="w-28 text-center">{dw_username}</div>
        <div className="w-28 text-center">{ws_date}</div>
        <div className="w-28 flex justify-center space-x-1">
          <span>{timeRange}</span> 
        </div>
        <div className="w-40 flex justify-center">{renderStatusButton(ws_status)}</div>
      </CardHeader>
    </Card>
  );
};

export default HistoryDogWalker;
