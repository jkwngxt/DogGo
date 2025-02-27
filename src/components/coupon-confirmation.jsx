import React from "react";
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
import { redirect } from "next/navigation";
const CouponConfirmation = ({  }) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">ใช้</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex items-center">
            <DialogTitle>ยืนยันการใช้คูปอง</DialogTitle>
            <DialogDescription className="text-md text-black">
              โปรดยืนยันการใช้คูปองของท่านอีกครั้ง
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2"></div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => redirect("/pet-owner/homepage")}>
              ยืนยัน
            </Button>
            <DialogClose asChild>
              <Button variant="destructive">ยกเลิก</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CouponConfirmation;
