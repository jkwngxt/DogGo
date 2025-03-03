import React from "react";
import { Card } from "@/components/ui/card";
import Reviews from "@/components/review";

export default function ServiceDescription() {
  const info = {
    c_id:"CP2314587",
    sp_name:"JA Pet 1",
    s_name:"ตัดขนสัตว์แบบพิเศษ",
    s_type:"กรูมมิ่ง ตัดแต่งขน",
    s_price:500,
    c_status:"สำเร็จ",
    s_des:"บริการตัดขนสัตว์แบบพิเศษที่ใส่ใจทุกรายละเอียดใช้ที่ตัดขนผลิตมาจากฝรั่งเศส",
    sp_tel:"012-345-6789",
    sp_address:"7/222 แขวงอรุณอมรินทร์ เขตบางกอกน้อย กรุงเทพมหานคร 10700",
    sp_des:"อาณาจักรของคนรักสัตว์เลี้ยงคุณจะได้รับประสบการณ์การบริการที่ดีที่สุด"
  };

  const myReviewData = [
    {
      r_id: 1,
      u_username: "jajabenjaporn",
      rating: 5,
      r_text: "พนักงานดูแลน้องดีมาก",
      avatar: "/image/user-placeholder.jpg",
    },
    {
      r_id: 2,
      u_username: "user2",
      rating: 4,
      r_text: "Great service!",
      avatar: "/image/user-placeholder.jpg",
    },
  ];


  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col px-10 items-center">
        <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
          รายละเอียดบริการ
        </h1>
        <Card className="w-[100%] sm:w-[60%] md:w-[60%] lg:w-[80%] p-6 h-auto flex flex-col justify-between">
          {/* Content Section */}
          <div className="flex-grow flex flex-col space-y-4 items-center">
          <h1 className="flex text-3xl font-bold">บริการ{info.s_name}</h1>
            <div className="flex justify-between w-[80%] px-10">
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <span className="font-bold">รายละเอียดบริการ:</span>
                  <span className="w-[40%]">{info.s_des}</span>
                </div>
              </div>
              <div className="space-y-2 w-[75%]">
                <div className="flex space-x-2">
                  <span className="font-bold">ประเภทบริการ:</span>
                  <span>{info.s_type}</span>
                </div>
                <div className="flex space-x-2">
                  <span className="font-bold">ราคา:</span>
                  <span>{info.s_price}</span>
                  <span>บาท</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 w-[80%] text-left">
              <h1 className="flex text-3xl font-bold">ข้อมูลร้านค้า</h1>
            </div>
            <div className="flex justify-between w-[80%] px-10">
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <span className="font-bold">ชื่อร้านค้า:</span>
                  <span>{info.sp_name}</span>
                </div>
                <div className="flex space-x-2">
                  <span className="font-bold">รายละเอียดร้านค้า:</span>
                  <span>{info.sp_des}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <span className="font-bold">เบอร์โทรติดต่อร้านค้า:</span>
                  <span>{info.sp_tel}</span>
                </div>
                <div className="flex space-x-2">
                  <span className="font-bold">ที่ตั้งร้านค้า:</span>
                  <span>{info.sp_address}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 w-[60%] px-16 text-left">
              <Reviews reviewData={myReviewData} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
