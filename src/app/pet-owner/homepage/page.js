import * as React from "react";
import { Card } from "@/components/ui/card";
import PetOwnerNav from "@/components/nav-bar/nav-pet-owner";
import HistoryDogWalker from "@/components/history-dog-walker";

export default function page() {
  const dogWalkerHistory = [
    {
      userImage: "/image/user-placeholder.jpg",
      dw_username: "John Doe",
      ws_date: "2025-02-26",
      startTime: "10:00",
      endTime: "11:00",
      ws_status: "รีวิว",
      rating: 4.5,
    },
    {
      userImage: "/image/user-placeholder.jpg",
      dw_username: "John Doe",
      ws_date: "2025-02-26",
      startTime: "10:00",
      endTime: "11:00",
      ws_status: "ได้รับบริการ",
      rating: 4.5,
    },
    {
      userImage: "/image/user-placeholder.jpg",
      dw_username: "John Doe",
      ws_date: "2025-02-26",
      startTime: "10:00",
      endTime: "11:00",
      ws_status: "การรับงานถูกปฏิเสธ",
      rating: 4.5,
    },
    {
      userImage: "/image/user-placeholder.jpg",
      dw_username: "John Doe",
      ws_date: "2025-02-26",
      startTime: "10:00",
      endTime: "11:00",
      ws_status: "อยู่ระหว่างดำเนินการ",
      rating: 4.5,
    },
    {
      userImage: "/image/user-placeholder.jpg",
      dw_username: "John Doe",
      ws_date: "2025-02-26",
      startTime: "10:00",
      endTime: "11:00",
      ws_status: "การบริการเสร็จสิ้น",
      rating: 4.5,
    },
  ];
  return (
    <div>
      <PetOwnerNav />
      <div className="flex p-6 space-y-4 items-center justify-center">
        <Card className="w-9/12 p-6 h-auto space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 ">
            รายการและสถานะบริการจูงสุนัข
          </h1>
          {dogWalkerHistory.map((walker, index) => (
            <HistoryDogWalker
              key={index}
              userImage={walker.userImage}
              dw_username={walker.dw_username}
              ws_date={walker.ws_date}
              startTime={walker.startTime}
              endTime={walker.endTime}
              ws_status={walker.ws_status}
              rating={walker.rating}
            />
          ))}
          <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
            คูปองของฉัน
          </h1>
        </Card>
      </div>
    </div>
  );
}
