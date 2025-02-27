"use client";

import * as React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
const HomeDogWalker = ({
  userImage,
  dw_username,
  dw_zone,
  dw_tel,
  rating,
}) => {
  return (
    <Card className="max-w-full mx px-4">
      <CardHeader className="flex flex flex-row justify-between items-center ">
        <img
          src={userImage}
          alt="User profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>{dw_username}</div>
        <div>{dw_zone}</div>
        <div>{dw_tel}</div>
        <div className="flex flex-row">
          <FontAwesomeIcon icon={faStar} className="h-5 w-5 text-yellow-400" />
          {rating}
        </div>
        <div className="space-x-4">
            <Button 
            variant="outline"
            onClick={()=>redirect('/pet-owner/dog-walker')}
            >รายละเอียด</Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default HomeDogWalker;
