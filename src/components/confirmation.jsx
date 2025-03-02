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

const Confirmation = ({ status, message, action, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex items-center">
          <DialogTitle>
            {status === "success" ? "ดำเนินการเสร็จสิ้น" : "ดำเนินการไม่สำเร็จ"}
          </DialogTitle>
          <DialogDescription className="text-md text-black">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button variant="secondary" onClick={action}>ตกลง</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Confirmation;