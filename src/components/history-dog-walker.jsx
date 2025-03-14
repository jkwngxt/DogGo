"use client";

import * as React from "react";
import { useRouter } from "next/navigation"; // Use next/router for navigation
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "./ui/button";
import OwnerWalkConfirmation from "./owner-walk-confirmation";
import ClickPayment from "./click-payment";

const HistoryDogWalker = ({
                              userImage,
                              dw_username,
                              ws_date,
                              timeRange,
                              ws_status,
                              isReviewed,
                              walkingServiceId,
                              onStatusUpdate,
                              serviceDate,
                              startHour,
                              endHour
                          }) => {
    const router = useRouter();
    const [status, setStatus] = React.useState(ws_status);
    const [showPaymentDialog, setShowPaymentDialog] = React.useState(false);

    // Function to check service time status (past, current, future)
    const getServiceTimeStatus = () => {
        const now = new Date();
        const serviceDateTime = new Date(serviceDate);

        // Set service start and end times
        const serviceStartTime = new Date(serviceDateTime);
        serviceStartTime.setHours(startHour, 0, 0, 0);

        const serviceEndTime = new Date(serviceDateTime);
        serviceEndTime.setHours(endHour, 0, 0, 0);

        // Log time comparison information with timezone details
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const nowISO = now.toISOString();
        const nowLocal = now.toString();

        // Check if service time is past, current, or future
        if (now > serviceEndTime) {
            return "past"; // Service time has passed
        } else if (now >= serviceStartTime && now <= serviceEndTime) {
            return "current"; // Currently in service time
        } else {
            return "future"; // Service time is in the future
        }
    };

    const handleCardClick = () => {
        router.push(`/dog-walker/walk-description/${walkingServiceId}`);
    };

    const handleButtonClick = (e) => {
        e.stopPropagation(); // Prevents triggering card click event
        router.push("/pet-owner/review");
    };

    const handleStatusUpdate = (id, newStatus) => {
        setStatus(newStatus);
        if (onStatusUpdate) {
            onStatusUpdate(id, newStatus);
        }
    };

    const renderStatusButton = () => {
        // Get time status for status 203 (Accepted)
        const timeStatus = getServiceTimeStatus();

        switch (status) {
            case 201: // Awaiting payment - Keep blue color (already set in ClickPayment component)
                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        <ClickPayment
                            walkingServiceId={walkingServiceId}
                        />
                    </div>
                );

            case 202: // Awaiting Response
                return <p className="font-bold text-[#FFB000]">อยู่ระหว่างดำเนินการ</p>;

            case 210: // Cancelled
                return <p className="font-bold text-red-500">ยกเลิกบริการ</p>;

            case 220: // Rejected
                return <p className="font-bold text-red-500">การรับงานถูกปฏิเสธ</p>;

            case 203: // Accepted -> Show different status based on time
                if (timeStatus === "past") {
                    // If service time has passed, show confirmation button
                    return (
                        <div onClick={(e) => e.stopPropagation()}>
                            <OwnerWalkConfirmation
                                walkingServiceId={walkingServiceId}
                                onStatusUpdate={() => handleStatusUpdate(walkingServiceId, 204)}
                                buttonColor="green"
                            />
                        </div>
                    );
                } else if (timeStatus === "current") {
                    // If currently in service time
                    return <p className="font-bold text-[#6498FA]">อยู่ในช่วงให้บริการ</p>;
                } else {
                    // If service time is in the future
                    return <p className="font-bold text-green-500">การจองได้รับการยืนยัน</p>;
                }

            case 204: // Completed - Show review button with yellow-orange star color
                return isReviewed ? (
                    <p className="font-bold text-[#6498FA]">การบริการเสร็จสิ้น</p>
                ) : (
                    <Button
                        onClick={handleButtonClick}
                        variant="secondary"
                        className="bg-[#FFB000] text-white hover:bg-[#F0A000]" // Yellow-orange star color
                    >
                        รีวิว
                    </Button>
                );

            default:
                return <Button disabled variant="outline">กำลังอัปเดต...</Button>;
        }
    };

    return (
        <Card className="max-w-full cursor-pointer" onClick={handleCardClick}>
            <CardHeader className="grid grid-cols-5 items-center gap-4">
                <div className="flex justify-left">
                    <img
                        src={userImage}
                        alt="User profile"
                        className="w-12 h-12 rounded-full object-cover"
                    /></div>
                <div className="w-28 text-center">{dw_username}</div>
                <div className="w-28 text-center">{ws_date}</div>
                <div className="w-28 flex justify-center space-x-1">
                    <span>{timeRange}</span>
                </div>
                <div className="w-40 flex justify-center">{renderStatusButton(ws_status)}</div>
            </CardHeader>
        </Card>
    );
};

export default HistoryDogWalker;