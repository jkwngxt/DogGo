"use client";

import * as React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "./button";

const WorkDescription = ({ userName, startTime,endTime, phoneNumber,status }) => {
  const handleClick = () => {
    console.log("Card is clicked!");
  };

  return (
      <Card className="max-w-full mx px-4">
        <CardHeader className="grid grid-cols-4 gap-4 items-center">
          <div>{userName}</div>
          <div className="flex-row space-x-1"><span>{startTime}</span> <span>-</span> <span>{ endTime }</span></div>
          <div>{phoneNumber}</div>
          {status === 1 ? (
          <p className="text-[#6498FA]">สิ้นสุด</p>
        ) : (
          <Button variant="outline" onClick={handleClick}>
            รายละเอียด
          </Button>
        )}
        </CardHeader>
      </Card>
  );
};

export default WorkDescription;
