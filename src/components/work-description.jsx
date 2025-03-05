"use client";

import * as React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const WorkDescription = ({ id, po_username, ws_date, startTime, endTime, po_tel, ws_status}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dog-walker/walk-description/${id}`);
  };

  // if 204: completed show 'สิ้นสุด'

  return (
      <Card className="max-w-full mx px-4" onClick={handleClick}>
        <CardHeader className="grid grid-cols-5 gap-4 items-center">
          <div>{po_username}</div>
          <div>{ws_date}</div>
          <div className="flex-row space-x-1"><span>{startTime}</span> <span>-</span> <span>{ endTime }</span></div>
          <div>{po_tel}</div>

          {ws_status === 204 ? (
          <p className="text-blue-600 font-semibold flex justify-center">สิ้นสุด</p>
          ) : (<Button variant="outline">รายละเอียด</Button>)}
        </CardHeader>
      </Card>
  );
};

export default WorkDescription;