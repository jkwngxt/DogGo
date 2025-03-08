"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import PaymentTimerUI from "./payment-timer";

const ClickPayment = ({ walkingServiceId }) => {
  const [showFirstDialog, setShowFirstDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [activatePaymentTimer, setActivatePaymentTimer] = useState(false);

  const handlePaymentClick = () => {
    setActivatePaymentTimer(true); // เปิดใช้งาน PaymentTimerUI
    setShowPaymentDialog(true);    // เปิด dialog
    setShowFirstDialog(false);     // ปิด dialog แรก
  };

  return (
      <>
        {/* ปุ่มกดเปิด dialog - เปลี่ยนเป็นสีฟ้า */}
        <Button
            variant="secondary"
            onClick={() => setShowFirstDialog(true)}
            className="bg-[#6498FA] text-white hover:bg-[#5080e0]"
        >
          ชำระค่าบริการ
        </Button>

        {/* Dialog ชำระเงิน */}
        <Dialog open={showFirstDialog} onOpenChange={setShowFirstDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>ต้องการชำระค่าบริการหรือไม่?</DialogTitle>
              <DialogDescription>
                กรุณากด "ดำเนินการชำระเงิน" เพื่อเริ่มขั้นตอนการชำระเงิน
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowFirstDialog(false)}>
                ยกเลิก
              </Button>
              <Button onClick={handlePaymentClick}>
                ดำเนินการชำระเงิน
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* PaymentTimerUI - เงื่อนไขการแสดงขึ้นอยู่กับ activatePaymentTimer แทน showPaymentDialog */}
        {activatePaymentTimer && (
            <PaymentTimerUI
                walkingServiceId={walkingServiceId}
                showPaymentDialog={showPaymentDialog}
                setShowPaymentDialog={setShowPaymentDialog}
            />
        )}
      </>
  );
};

export default ClickPayment;