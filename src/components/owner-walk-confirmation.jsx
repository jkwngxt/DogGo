"use client";

import React from "react";
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

const OwnerWalkConfirmation = () => {
  const router = useRouter(); // Initialize router

  const handleConfirmClick = (e) => {
    e.stopPropagation(); // Prevents triggering card's click event
    router.push("/pet-owner/homepage"); // Navigate to homepage
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" onClick={(e) => e.stopPropagation()}>
          ได้รับบริการ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
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
  );
};

export default OwnerWalkConfirmation;
