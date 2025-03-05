"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

const HomeDogWalker = ({
                           id,
                           userImage,
                           dw_name,
                           dw_zone,
                           rating,
                           ratingCount,
                           dw_tel,
                           onSelect
                       }) => {
    // Default phone number if not provided
    dw_tel = dw_tel ? dw_tel : "0000000000";

    const formatPhoneNumber = (phoneNumber) => {
        // Remove all non-digit characters
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');

        // Check if the input is valid
        if (cleaned.length < 9 || cleaned.length > 10) return phoneNumber;

        // Format according to the length of the number
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        } else if (cleaned.length === 9) {
            return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
        }

        return phoneNumber;
    };

    // Function to handle image errors
    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = "/image/user-placeholder.jpg";
    };

    // Function to manage image path
    const getImagePath = (picPath) => {
        if (!picPath) return "/image/user-placeholder.jpg";
        if (picPath.startsWith('http')) return picPath;

        const normalizedPath = picPath.startsWith('/') ? picPath.slice(1) : picPath;
        return `/api/images/${normalizedPath}`;
    };

    return (
        <Card className="max-w-full mx-auto mb-4 hover:shadow-md transition-shadow rounded-xl overflow-hidden p-6">
            <div className="flex items-center w-full">
                {/* Left section - Profile image and name */}
                <div className="flex items-center space-x-4 w-1/4 min-w-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                            src={getImagePath(userImage)}
                            alt={`${dw_name.trim()} profile`}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                        />
                    </div>
                    <div className="font-medium text-lg truncate overflow-hidden">
                        {dw_name}
                    </div>
                </div>

                {/* Middle section - Service areas */}
                <div className="text-gray-600 w-1/4 min-w-0 px-2">
                    <div className="truncate">
                        {dw_zone.trim()}
                    </div>
                </div>

                {/* Phone number section - moved more to the right */}
                <div className="text-gray-600 w-1/5 text-right pr-10 min-w-0">
                    <div className="truncate">
                        {formatPhoneNumber(dw_tel.trim())}
                    </div>
                </div>

                {/* Right section - Rating and button with fixed-width containers */}
                <div className="flex items-center justify-end w-1/4 flex-shrink-0">
                    {/* Rating container with fixed width to maintain alignment */}
                    <div className="flex items-center w-32 justify-end mr-4">
                        <FontAwesomeIcon icon={faStar} className="h-5 w-5 text-yellow-400 mr-1"/>
                        <span className="font-medium">{rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({ratingCount})</span>
                    </div>

                    {/* Button in fixed position */}
                    <Button
                        variant="outline"
                        onClick={onSelect}
                        className="text-blue-500 border-blue-500 hover:bg-blue-50 rounded-lg px-4 w-28"
                    >
                        รายละเอียด
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default HomeDogWalker;