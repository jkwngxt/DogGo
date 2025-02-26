import React from "react";
import PetOwnerNav from "@/components/nav-bar/nav-pet-owner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PaymentTimer from "@/components/payment-timer";

export default function Billing() {
  const info = {
    userImage: "/image/user-placeholder.jpg",
    dw_username: "John Doe",
    ws_date: "2025-02-19",
    startTime: "10:00",
    endTime: "12:00",
    dw_tel: "(555) 123-4567",
    total: 500,
    dogs: ["มะลิ", "ชบา"],
  };
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const formattedDate = formatDate(info.ws_date);
  return (
    <>
      <PetOwnerNav />
      <div className="p-4 space-y-4">
        <div className="flex flex-col px-10 items-center">
          <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
            รายละเอียดการชำระเงิน
          </h1>
          <Card className="w-[100%] sm:w-[60%] md:w-[60%] lg:w-[80%] p-6">
            <div className="flex flex-col space-y-4 items-center">
              <h1 className="text-3xl font-bold">รายละเอียดการจอง</h1>
              <div className="flex justify-between w-6/12">
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
                </div>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <span className="font-bold">เบอร์โทรติดต่อ:</span>
                    <span>{info.dw_tel}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row space-x-4">
                <PaymentTimer
                total={info.total}/>
                <Button variant="destructive">ยกเลิก</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
