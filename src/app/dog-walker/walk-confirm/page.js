import React from "react";
import { Card } from "@/components/ui/card";
import WalkerWalkConfirmation from "@/components/walker-walk-confirmation";

export default function DogWalkConfirm() {
  const info = {
    pet_owner: "Pet Owner 1",
    dw_zone: "บางรัก",
    u_address: "7/222 แขวงอรุณอมรินทร์ เขตบางรัก กรุงเทพมหานคร 10700",
    u_tel: "0121234567",
    dw_username: "Dog Walker 1",
    ws_date: "2025-02-19",
    startTime: "10:00",
    endTime: "12:00",
    dw_tel: "5551234567",
    total: 500,
    dogs: ["มะลิ", "ชบา"],
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const formattedDate = formatDate(info.ws_date);
  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col px-10 items-center">
        <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
          รายละเอียดงาน
        </h1>
        <Card className="w-[100%] sm:w-[60%] md:w-[60%] lg:w-[80%] p-6 h-[70vh] flex flex-col justify-between">
          {/* Content Section */}
          <div className="flex-grow flex flex-col space-y-4 items-center">
            <div className="space-y-4 w-[60%] text-left">
              <h1 className="flex text-3xl font-bold">ข้อมูลลูกค้า</h1>
            </div>
            <div className="flex justify-between w-[60%] px-10">
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <span className="font-bold">ชื่อพนักงาน:</span>
                  <span>{info.dw_username}</span>
                </div>
                <div className="flex space-x-2">
                  <span className="font-bold">เขตที่อยู่:</span>
                  <span>{info.dw_zone}</span>
                </div>
                <div className="flex space-x-2">
                  <span className="font-bold">ที่อยู่:</span>
                  <span className="w-[60%]">{info.u_address}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <span className="font-bold">วันที่:</span>
                  <span>{formattedDate}</span>
                  <div className="flex-row space-x-1"></div>
                </div>
                <div className="flex space-x-2">
                  <span className="font-bold">เวลาที่จอง:</span>
                  <div className="flex-row space-x-1">
                    <span>{info.startTime}</span>
                    <span>-</span>
                    <span>{info.endTime}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className="font-bold">เบอร์โทรติดต่อ:</span>
                  <span>{info.dw_tel}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 w-[60%] text-left">
              <h1 className="flex text-3xl font-bold">ข้อมูลผู้รับผิดชอบ</h1>
            </div>
            <div className="flex justify-between w-[60%] px-10">
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <span className="font-bold">ชื่อพนักงาน:</span>
                  <span>{info.dw_username}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <span className="font-bold">เบอร์โทรติดต่อ:</span>
                  <span>{info.dw_tel}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 w-[60%] px-16 text-left">
              <span className="font-bold">รายการสุนัข</span>
              <DogTable dogs={info.dogs} />
            </div>
            {/* Button Section */}
            <div className="flex flex-row space-x-4 justify-center">
              <WalkerWalkConfirmation type="รับงาน" />
              <WalkerWalkConfirmation type="ปฏิเสธ" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
