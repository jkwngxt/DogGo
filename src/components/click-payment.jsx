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
import ConfirmationDialogs from "./confirmation-dialogs";

const ClickPayment = ({ walkingServiceId }) => {
  const [showFirstDialog, setShowFirstDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handlePaymentClick = () => {
    setShowPaymentDialog(true);
    setShowFirstDialog(false);
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
  };

  return (
    <>
      {/* ปุ่มกดเปิด dialog */}
      <Button variant="secondary" onClick={() => setShowFirstDialog(true)}>
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

      {/* PaymentTimerUI */}
      {showPaymentDialog && (
        <PaymentTimerUI
          walkingServiceId={walkingServiceId}
          showPaymentDialog={showPaymentDialog}
          setShowPaymentDialog={setShowPaymentDialog}
        />
      )}

      {/* Success Dialog */}
      <ConfirmationDialogs
        showSuccessDialog={showSuccessDialog}
        message="การได้รับบริการสำเร็จ"
        onSuccessClose={handleDialogClose}
      />
    </>
  );
};

export default ClickPayment;