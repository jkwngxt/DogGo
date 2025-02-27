import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import Reviews from "@/components/review";
import React from "react";
import ClientDogSelector from "@/components/client-dog";

export default function DogWalker() {
  const info = {
    userImage: "/image/user-placeholder.jpg",
    dw_username: "John Doe",
    dw_zone: "New York, NY",
    dw_tel: "(555) 123-4567",
    rating: "4.8",
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

  const dogs = ["มะลิ", "ชบา"];

  return (
    <>
      <div className="p-4 space-y-4">
        <div className="flex flex-col px-10 items-center">
          <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
            รายละเอียด Dog Walker
          </h1>
          <Card className="w-[100%] sm:w-[60%] md:w-[60%] lg:w-[80%] p-6">
            <div className="flex flex-col space-y-2 items-center">
              <img
                src={info.userImage}
                alt="User profile"
                className="w-25 h-25 rounded-full object-cover"
              />
              <div className="flex flex-row font-bold">
                <FontAwesomeIcon
                  icon={faStar}
                  className="h-5 w-5 text-yellow-400"
                />
                {info.rating}
              </div>
              <div className="flex justify-between w-6/12">
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <span className="font-bold">ชื่อพนักงาน:</span>
                    <span>{info.dw_username}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="font-bold">เขตที่ดูแล:</span>
                    <span>{info.dw_zone}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <span className="font-bold">เบอร์โทรติดต่อ:</span>
                    <span>{info.dw_tel}</span>
                  </div>
                </div>
              </div>

              <Reviews reviewData={myReviewData} />
              <div className="flex flex-row space-x-4">
                <ClientDogSelector dogs={dogs} />
                <Button variant="destructive">ยกเลิก</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
