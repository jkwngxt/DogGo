import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import Reviews from "@/components/ui/review";
import React from "react";

export default function DogWalker() {
  const info = {
    userImage: "/image/user-placeholder.jpg",
    userName: "John Doe",
    location: "New York, NY",
    phoneNumber: "(555) 123-4567",
    reviewScore: "4.8",
  };

  const myReviewData = [
    {
      id: 1,
      username: 'jajabenjaporn',
      rating: 5,
      comment: 'พนักงานดูแลน้องดีมากลืมบ้านน้องรู้สึงสุดๆ',
      avatar: '/image/user-placeholder.jpg' 
    },
    {
      id: 2,
      username: 'user2',
      rating: 4,
      comment: 'Great service!',
      avatar: '/image/user-placeholder.jpg'  
    }
  ];

  return (
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
              {info.reviewScore}
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row space-x-2">
                <span className="font-bold">ชื่อพนักงาน:</span>
                <span>{info.userName}</span>
              </div>
              <div className="flex flex-row space-x-2">
                <span className="font-bold">เบอร์โทรติดต่อ:</span>
                <span>{info.phoneNumber}</span>
              </div>
              <div className="flex flex-row space-x-2">
                <span className="font-bold">เขตที่ดูแล:</span>
                <span>{info.location}</span>
              </div>
            </div>
            <Reviews reviewData={myReviewData}/>
            <div className="flex flex-row space-x-4">
              <Button>เลือก</Button>
              <Button variant="destructive">ยกเลิก</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
