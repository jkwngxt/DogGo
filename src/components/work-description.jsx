"use client";

import * as React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

const WorkDescription = ({ dw_username, startTime,endTime, dw_tel,ws_status }) => {
  const handleClick = () => {
    {redirect("/dog-walker/walk-confirm")}
  };

  const handleDescriptionClick = () => {
    {redirect("/dog-walker/walk-description")}
  }

  return (
      <Card className="max-w-full mx px-4">
        <CardHeader className="grid grid-cols-4 gap-4 items-center">
          <div>{dw_username}</div>
          <div className="flex-row space-x-1"><span>{startTime}</span> <span>-</span> <span>{ endTime }</span></div>
          <div>{dw_tel}</div>
          {ws_status === 1 ? (
          <p className="text-[#6498FA]" onClick={handleDescriptionClick}>สิ้นสุด</p>
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
