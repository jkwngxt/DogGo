"use client";

import * as React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./ui/button";
import WalkConfirmation from "./walk-confirmation";

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
    if (ws_status === "เสร็จสิ้นบริการ") {
      return <Button variant="secondary">เสร็จสิ้นบริการ</Button>;
    }
    return <WalkConfirmation ws_status={ws_status} />;
  };

  return (
    <Card className="max-w-full mx px-4">
      <CardHeader className="flex flex flex-row justify-between items-center">
        <img
          src={userImage}
          alt="User profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>{dw_username}</div>
        <div>{formattedDate}</div>
        <div className="flex-row space-x-1">
          <span>{startTime}</span> <span>-</span> <span>{endTime}</span>
        </div>
        <div className="flex flex-row">
          <FontAwesomeIcon icon={faStar} className="h-5 w-5 text-yellow-400" />
          {rating}
        </div>
        <div className="space-x-4">{renderStatusButton(ws_status)}</div>
      </CardHeader>
    </Card>
  );
};

export default HistoryDogWalker;
