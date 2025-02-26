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
const WalkConfirmation = ({ ws_status }) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
        {ws_status === "ได้รับบริการ"
                  ?  <Button variant="secondary">ได้รับบริการ</Button>
                  : <Button variant="destructive" className="bg-black/50" >ไม่ได้รับบริการ</Button>}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex items-center">
            <DialogTitle>  {ws_status === "ได้รับบริการ"
                  ? "ยืนยันการได้รับบริการ"
                  : "ยืนยันการไม่ได้รับบริการ"}</DialogTitle>
            <DialogDescription className="text-md text-black">
                {ws_status === "ได้รับบริการ"
                  ? "โปรดยืนยันการได้รับบริการของท่านอีกครั้ง"
                  : "โปรดยืนยันการไม่ได้รับบริการของท่านอีกครั้ง"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2"></div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button onClick={ws_status === "ได้รับบริการ"
                  ? ()=>redirect('/pet-owner/review')
                  : ()=>redirect('/pet-owner/homepage')}>ยืนยัน</Button>
            <DialogClose asChild>
              <Button variant="destructive">ยกเลิก</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalkConfirmation;
