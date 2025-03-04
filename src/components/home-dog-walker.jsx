"use client";

import * as React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

const HomeDogWalker = ({
                         id,
                         userImage,
                         dw_username,
                         dw_zone,
                         rating,
                         ratingCount,
                         onSelect
                       }) => {
  // ฟังก์ชันจัดการการแสดงรูปภาพ
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/image/user-placeholder.jpg";
  };

  // ฟังก์ชันจัดการการแสดงรูปภาพ
  const getImagePath = (picPath) => {
    if (!picPath) return "/image/user-placeholder.jpg";
    if (picPath.startsWith('http')) return picPath;

    const normalizedPath = picPath.startsWith('/') ? picPath.slice(1) : picPath;
    return `/api/images/${normalizedPath}`;
  };

  return (
      <Card className="max-w-full mx-auto px-4 mb-4 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row justify-between items-center p-4">
          <div className="flex items-center space-x-4">
            <img
                src={getImagePath(userImage)}
                alt={`${dw_username} profile`}
                className="w-16 h-16 rounded-full object-cover border border-gray-200"
                onError={handleImageError}
            />
            <div className="font-medium">{dw_username}</div>
          </div>

          <div className="hidden md:block">{dw_zone}</div>

          <div className="flex items-center">
            <FontAwesomeIcon icon={faStar} className="h-5 w-5 text-yellow-400 mr-1" />
            <span>{rating}</span>
            <span className="text-sm text-gray-500 ml-1">({ratingCount})</span>
          </div>

          <div>
            <Button
                variant="outline"
                onClick={onSelect}
            >
              รายละเอียด
            </Button>
          </div>
        </CardHeader>
      </Card>
  );
};

export default HomeDogWalker;