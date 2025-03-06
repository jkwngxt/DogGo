import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from './ui/button';

const ConfirmationDialogs = ({
                               showSuccessDialog,
                               showErrorDialog,
                               message,
                               title, // เพิ่ม title prop
                               onSuccessClose,
                               onErrorClose }) => {
  return (
      <>
        <Dialog open={showSuccessDialog} onOpenChange={onSuccessClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="flex items-center">
              <DialogTitle>
                {title || "ดำเนินการเสร็จสิ้น"} {/* ใช้ค่า title ที่ส่งมา หรือใช้ค่า default */}
              </DialogTitle>
              <DialogDescription className="text-md text-black">
                {message}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Button variant="secondary" onClick={onSuccessClose}>ตกลง</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showErrorDialog} onOpenChange={onErrorClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="flex items-center">
              <DialogTitle>
                {title || "ดำเนินการไม่สำเร็จ"} {/* ใช้ค่า title ที่ส่งมา หรือใช้ค่า default */}
              </DialogTitle>
              <DialogDescription className="text-md text-black">
                {message}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Button variant="secondary" onClick={onErrorClose}>ตกลง</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </>
  );
};

export default ConfirmationDialogs;