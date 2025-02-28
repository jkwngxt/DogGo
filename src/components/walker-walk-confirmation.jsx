"use client";
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
const WalkerWalkConfirmation = ({ type }) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
        {type === "รับงาน"
                  ?  <Button >รับงาน</Button>
                  : <Button variant="destructive">ปฏิเสธ</Button>}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex items-center">
            <DialogTitle>  {type === "รับงาน"
                  ? "ยืนยันการรับงาน"
                  : "ยืนยันการไม่รับงาน"}</DialogTitle>
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
            <Button onClick={()=>redirect('/dog-walker/workpage')}>ยืนยัน</Button>
            <DialogClose asChild>
              <Button variant="destructive">ยกเลิก</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalkerWalkConfirmation;