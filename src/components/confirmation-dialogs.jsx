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
  onSuccessClose,
  onErrorClose }) => {
  return (
    <>
    <Dialog open={showSuccessDialog} onOpenChange={onSuccessClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex items-center">
          <DialogTitle>
            ดำเนินการเสร็จสิ้น
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
           ดำเนินการไม่สำเร็จ
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