import * as React from "react";
import { Card } from "@/components/ui/card";
import HistoryDogWalker from "@/components/history-dog-walker";
import CouponCard from "@/components/coupon-card";

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
      <div className="flex flex-col p-6 space-y-4 items-center justify-center">
        <div className="w-9/12">
          <h1 className="text-left text-3xl font-bold text-gray-900 mb-4">
            รายการและสถานะบริการจูงสุนัข
          </h1>
          <Card className="p-6 h-auto space-y-4">
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
          </Card>
        </div>

        <div className="w-9/12">
          <h1 className="text-left text-3xl font-bold text-gray-900 mb-4">
            คูปองของฉัน
          </h1>
          <Card className="p-6 h-auto space-y-4">
            {/* Add your coupon content here */}
            <CouponCard
              c_id="CP2314587"
              sp_name="JA Pet 1"
              s_name="ตัดขนสัตว์แบบพิเศษ"
              s_type="กรูมมิ่ง ตัดแต่งขน"
              s_price={500}
              c_status="ใช้"
            />

            <CouponCard
              c_id="CP2314587"
              sp_name="JA Pet 1"
              s_name="ตัดขนสัตว์แบบพิเศษ"
              s_type="กรูมมิ่ง ตัดแต่งขน"
              s_price={500}
              c_status="รีวิว"
            />

            <CouponCard
              c_id="CP2314587"
              sp_name="JA Pet 1"
              s_name="ตัดขนสัตว์แบบพิเศษ"
              s_type="กรูมมิ่ง ตัดแต่งขน"
              s_price={500}
              c_status="สำเร็จ"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
