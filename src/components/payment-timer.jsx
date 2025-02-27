"use client";
import React, { useState, useEffect, useRef } from "react";
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

const PaymentTimer = ({total,}) => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)
  const timerRef = useRef(null);

  useEffect(() => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">ชำระเงิน</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md flex flex-col items-center">
        <img
        src="/image/payment-qr.png"
        alt="qr-code"/>
        <DialogHeader className="flex items-center">
          <DialogTitle>{total} บาท</DialogTitle>
          <DialogDescription className="text-sm text-black">
            ชื่อบัญชี: บริษัท DogGo Thailand
          </DialogDescription>
          <DialogDescription className="text-md text-black">
           โปรดชำระเงินภายใน
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center text-2xl font-bold">
          {formatTime(timeLeft)} นาที
        </div>
        <DialogFooter className="sm:justify-center">
        <Button>เสร็จสิ้น</Button>
          <DialogClose asChild>
            <Button variant="destructive">ยกเลิก</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentTimer;
