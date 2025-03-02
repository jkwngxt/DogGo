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
import Confirmation from "./confirmation";

const OwnerWalkConfirmation = () => {
  const router = useRouter();
  const [showFirstDialog, setShowFirstDialog] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirmClick = () => {
    console.log("Confirmation button clicked"); // Console log
    setShowFirstDialog(false); // Close first dialog
    setShowConfirmation(true); // Show Confirmation dialog
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
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

      <Confirmation 
        status="success"
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        message="การได้รับบริการสำเร็จ"
        action={handleCloseConfirmation}
        />
    </>
  );
};

export default OwnerWalkConfirmation;