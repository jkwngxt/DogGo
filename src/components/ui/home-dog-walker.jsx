"use client";

import * as React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HomeDogWalker = ({
  userImage,
  userName,
  location,
  phoneNumber,
  reviewScore,
}) => {
  return (
    <Card className="max-w-full mx px-4">
      <CardHeader className="flex flex flex-row justify-between items-center ">
        <img
          src={userImage}
          alt="User profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>{userName}</div>
        <div>{location}</div>
        <div>{phoneNumber}</div>
        <div className="flex flex-row">
          <FontAwesomeIcon icon={faStar} className="h-5 w-5 text-yellow-400" />
          {reviewScore}
        </div>
        <div className="space-x-4">
          <Button variant="secondary">เลือก</Button>
          <Link href="/pet-owner/walking-service/dog-walker">
            <Button variant="outline">รายละเอียด</Button>
          </Link>
        </div>
      </CardHeader>
    </Card>
  );
};

export default HomeDogWalker;
