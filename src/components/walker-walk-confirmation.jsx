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

const WalkerWalkConfirmation = ({ type }) => {
  const router = useRouter();
  const [showFirstDialog, setShowFirstDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [message, setMessage] = useState("");

  const handleConfirmClick = () => {
    setShowFirstDialog(false); // Close first dialog
    if (type === "รับงาน") {
      setMessage("การรับงานสำเร็จ");
    } else {
      setMessage("การปฏิเสธงานสำเร็จ");
    }
    setShowSuccessDialog(true);
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    router.push("/dog-walker/history"); 
  };

  return (
    <div>
      {/* First Confirmation Dialog */}
      <Dialog open={showFirstDialog} onOpenChange={setShowFirstDialog}>
        <DialogTrigger asChild>
          {type === "รับงาน" ? (
            <Button>รับงาน</Button>
          ) : (
            <Button variant="destructive">ปฏิเสธ</Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex items-center">
            <DialogTitle>
              {type === "รับงาน" ? "ยืนยันการรับงาน" : "ยืนยันการปฏิเสธงาน"}
            </DialogTitle>
            <DialogDescription className="text-md text-black">
              {type === "รับงาน"
                ? "โปรดยืนยันการรับงานของท่านอีกครั้ง"
                : "โปรดยืนยันการปฏิเสธงานของท่านอีกครั้ง"}
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

      {/* Success Dialogs */}
      <ConfirmationDialogs
        showSuccessDialog={showSuccessDialog}
        showErrorDialog={false}
        message={message}
        onSuccessClose={handleDialogClose}
        onErrorClose={false}
      />
    </div>
  );
};

export default WalkerWalkConfirmation;
