"use client";

import * as React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./ui/button";
import OwnerWalkConfirmation from "./owner-walk-confirmation";
import { redirect } from "next/navigation";

const HistoryDogWalker = ({
  userImage,
  dw_username,
  ws_date,
  startTime,
  endTime,
  ws_status,
  rating,
}) => {
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const formattedDate = formatDate(ws_date);
  const renderStatusButton = (ws_status) => {
    if (ws_status === "รีวิว") {
      return (
        <Button
          onClick={() => redirect("/pet-owner/review")}
          variant="secondary"
        >
          รีวิว
        </Button>
      );
    }
    if (ws_status === "การรับงานถูกปฏิเสธ") {
      return <p className="font-bold text-red-500">การรับงานถูกปฏิเสธ</p>;
    }
    if (ws_status === "อยู่ระหว่างดำเนินการ") {
      return <p className="font-bold text-[#FFB000]">อยู่ระหว่างดำเนินการ</p>;
    }
    if (ws_status === "การบริการเสร็จสิ้น") {
      return <p className="font-bold text-[#6498FA]">การบริการเสร็จสิ้น</p>;
    }
    return <OwnerWalkConfirmation/>;
  };

  return (
    <div
      onClick={() => redirect("/pet-owner/walk-description")}
    >
      <Card className="max-w-full">
        <CardHeader className="grid grid-cols-6 items-center gap-4">
          <img
            src={userImage}
            alt="User profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="w-28 text-center">{dw_username}</div>
          <div className="w-28 text-center">{formattedDate}</div>
          <div className="w-28 flex justify-center space-x-1">
            <span>{startTime}</span> <span>-</span> <span>{endTime}</span>
          </div>
          <div className="w-28 flex justify-center items-center space-x-1">
            <FontAwesomeIcon
              icon={faStar}
              className="h-5 w-5 text-yellow-400"
            />
            <span>{rating}</span>
          </div>
          <div className="w-40 flex justify-center">
            {renderStatusButton(ws_status)}
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default HistoryDogWalker;
