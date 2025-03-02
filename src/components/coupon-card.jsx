"use client";

import * as React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";
const CouponCard = ({ c_id, sp_name, s_name, s_type, s_price, c_status }) => {
  const renderStatusButton = (c_status) => {
    if (c_status === "รีวิว") {
      return (
        <Button
          onClick={() => redirect("/pet-owner/review")}
          variant="secondary">
          รีวิว
        </Button>
      );
    }
    if (c_status === "ใช้") {
      {
        /* TODO: replace with Conformation dialog */
      }
      return (
        <Button
          onClick={() => redirect("/pet-owner/review")}
          variant="secondary">
          ใช้
        </Button>
      );
    }
    if (c_status === "สำเร็จ") {
      return <p className="font-bold text-[#6498FA]">สำเร็จ</p>;
    }
    return <></>;
  };

  return (
    <div onClick={() => redirect("/pet-owner/service-description")}>
      <Card className="max-w-full">
        <CardHeader className="grid grid-cols-6 items-center gap-4">
          <div className="w-28 text-center">{c_id}</div>
          <div className="w-28 text-center">{sp_name}</div>
          <div className="w-36 text-center">{s_name}</div>
          <div className="w-32 text-center">{s_type}</div>
          <div className="w-28 text-center">{s_price}</div>
          <div className="w-28 flex justify-center">
            {renderStatusButton(c_status)}
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default CouponCard;
