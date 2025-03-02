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

const WalkerWalkConfirmation = ({ type }) => {
   const router = useRouter();
    const [showFirstDialog, setShowFirstDialog] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
  
    const handleConfirmClick = () => {
      console.log("Confirmation button clicked");
      setShowFirstDialog(false); // Close first dialog
      setShowConfirmation(true); // Show Confirmation dialog
    };
  
    const handleCloseConfirmation = () => {
      setShowConfirmation(false);
       // handle เปลี่ยนสถานะตาม type 
      router.push("/dog-walker/history"); // Navigate after confirmation closes
    };

  return (
    <div>
      <Dialog open={showFirstDialog} onOpenChange={setShowFirstDialog}>
        <DialogTrigger asChild>
        {type === "รับงาน"
                  ?  <Button >รับงาน</Button>
                  : <Button variant="destructive">ปฏิเสธ</Button>}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex items-center">
            <DialogTitle>  {type === "รับงาน"
                  ? "ยืนยันการรับงาน"
                  : "ยืนยันการปฏิเสธงาน"}</DialogTitle>
            <DialogDescription className="text-md text-black">
                {type === "รับงาน"
                  ? "โปรดยืนยันการรับงานของท่านอีกครั้ง"
                  : "โปรดยืนยันการปฏิเสธงานของท่านอีกครั้ง"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2"></div>
          </div>
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
        message={type === "รับงาน"
                ? "การรับงานสำเร็จ"
                : "การปฏิเสธงานสำเร็จ"}
        action={handleCloseConfirmation}
        />
    </div>
  );
};

export default WalkerWalkConfirmation;