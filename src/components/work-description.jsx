"use client";

import * as React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const WorkDescription = ({ id, po_username, ws_date, startTime, endTime, po_tel }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dog-walker/walk-description/${id}`);
  };

  return (
      <Card className="max-w-full mx px-4" onClick={handleClick}>
        <CardHeader className="grid grid-cols-5 gap-4 items-center">
          <div>{po_username}</div>
          <div>{ws_date}</div>
          <div className="flex-row space-x-1"><span>{startTime}</span> <span>-</span> <span>{ endTime }</span></div>
          <div>{po_tel}</div>
          <Button variant="outline">รายละเอียด</Button>
        </CardHeader>
      </Card>
  );
};

export default WorkDescription;