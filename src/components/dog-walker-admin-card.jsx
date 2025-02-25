"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
} from "@/components/ui/card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar} from '@fortawesome/free-solid-svg-icons';

const DogWalkerAdminCard = ({ userImage, dw_username, dw_zone, dw_tel, rating}) => {
const handleClick = () => {
    console.log("Card is clicked!")
  
};
return (
  <button 
      className="w-full p-0 h-auto"
      onClick={handleClick}
    >
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
        <FontAwesomeIcon icon={faStar} className="h-5 w-5 text-yellow-400"/>
        {rating}
        </div>
      </CardHeader>
    </Card>
    </button>
  )
}
  
  export default DogWalkerAdminCard