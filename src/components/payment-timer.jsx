"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ConfirmationDialogs from "./confirmation-dialogs";
import usePayment from "@/hooks/usePayment";

/**
 * Component แสดง UI สำหรับกระบวนการชำระเงิน
 * @param {Object} props - คุณสมบัติของ component
 * @param {number} props.total - จำนวนเงินทั้งหมด
 * @param {Object} props.bookingInfo - ข้อมูลการจอง
 * @returns {JSX.Element} PaymentTimerUI component
 */
const PaymentTimerUI = ({ total, bookingInfo }) => {
  const {
    showPaymentDialog,
    showSuccessDialog,
    showErrorDialog,
    message,
    dialogTitle,
    isLoading,
    isConfirmingPayment,
    bookingData,
    timeLeft,
    formatTime,
    formatDeadlineTime,
    handlePaymentClick,
    handleConfirmClick,
    handleCancelBooking,
    handleErrorDialogClose,
    handleSuccessDialogClose,
    setShowPaymentDialog
  } = usePayment({ total, bookingInfo });

  return (
      <>
        {/* Payment Dialog with QR Code */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="sm:max-w-md flex flex-col items-center">
            <img
                src="/image/payment-qr-crop.png"
                alt="qr-code"
            />
            <DialogHeader className="flex items-center">
              <DialogTitle>
                กรุณาชำระเงิน {bookingData && bookingData.amount ? bookingData.amount : total} บาท
              </DialogTitle>
              <DialogDescription className="text-sm text-black">
                ชื่อบัญชี: บริษัท DogGo Thailand
              </DialogDescription>
              <DialogDescription className="text-md text-black">
                โปรดชำระเงินภายในเวลา {formatDeadlineTime()}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center text-2xl font-bold">
              เหลือเวลา {formatTime(timeLeft)}
            </div>
            <DialogFooter className="sm:justify-center">
              <Button
                  className={"w-32"}
                  onClick={handleConfirmClick}
                  disabled={isConfirmingPayment}
              >
                {isConfirmingPayment ? "กำลังยืนยัน..." : "ยืนยันการชำระเงิน"}
              </Button>
              <Button
                  variant="destructive"
                  className={"w-32"}
                  onClick={handleCancelBooking}
              >
                ยกเลิกการจอง
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success & Error Confirmation Dialogs */}
        <ConfirmationDialogs
            showSuccessDialog={showSuccessDialog}
            showErrorDialog={showErrorDialog}
            message={message}
            title={dialogTitle}
            onSuccessClose={handleSuccessDialogClose}
            onErrorClose={handleErrorDialogClose}
        />

        {/* Export ฟังก์ชันเริ่มกระบวนการชำระเงินให้ใช้จาก parent component */}
        <Button
            variant="default"
            onClick={handlePaymentClick}
            disabled={isLoading}
        >
          {isLoading ? "กำลังดำเนินการ..." : "ชำระเงิน"}
        </Button>
      </>
  );
};

export default PaymentTimerUI;