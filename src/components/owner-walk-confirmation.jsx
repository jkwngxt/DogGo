"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ConfirmationDialogs from "./confirmation-dialogs";

const OwnerWalkConfirmation = ({ walkingServiceId, onStatusUpdate }) => {
  const router = useRouter();
  const [showFirstDialog, setShowFirstDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const handleConfirmClick = async () => {
    try {
      console.log("Updating status for ID:", walkingServiceId);

      const response = await fetch("/api/walking-service/change-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: 204, // Update status to completed
          walkingServiceId: walkingServiceId,
        }),
      });

      const result = await response.json();
      console.log("Update Result:", result);

      if (response.ok) {
        if (onStatusUpdate) {
          onStatusUpdate(walkingServiceId, "รีวิว");
        }
        setShowFirstDialog(false);
        setShowSuccessDialog(true);
      } else {
        console.error("Error updating status:", result.error);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    router.push("/pet-owner/homepage"); // Navigate after confirmation closes
  };

  return (
    <>
      <Dialog open={showFirstDialog} onOpenChange={setShowFirstDialog}>
        <DialogTrigger asChild>
          <Button 
            variant="secondary" 
            onClick={() => setShowFirstDialog(true)}
          >
            ได้รับบริการ
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex items-center">
            <DialogTitle>ยืนยันการได้รับบริการ</DialogTitle>
            <DialogDescription className="text-md text-black">
              โปรดยืนยันการได้รับบริการของท่านอีกครั้ง
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleConfirmClick}>ยืนยัน</Button>
            <DialogClose asChild>
              <Button variant="destructive">ยกเลิก</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationDialogs
        showSuccessDialog={showSuccessDialog}
        message="การได้รับบริการสำเร็จ"
        onSuccessClose={handleDialogClose}
      />
    </>
  );
};

export default OwnerWalkConfirmation;