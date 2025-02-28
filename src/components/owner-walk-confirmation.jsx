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
const OwnerWalkConfirmation = ({  }) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">ได้รับบริการ</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex items-center">
            <DialogTitle>ยืนยันการได้รับบริการ</DialogTitle>
            <DialogDescription className="text-md text-black">
              โปรดยืนยันการได้รับบริการของท่านอีกครั้ง
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

export default OwnerWalkConfirmation;
