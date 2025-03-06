"use client";

import React, { useState, useEffect } from "react";
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
import ConfirmationDialogs from "./confirmation-dialogs";

const WalkerWalkConfirmation = ({ type, wsId }) => {
  const router = useRouter();
  const [showFirstDialog, setShowFirstDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serviceInfo, setServiceInfo] = useState(null);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!wsId) {
        setError("Missing service ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/walking-service/service-detail/${wsId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!data.success) {
          setError(data.message || "Error loading service details.");
        }

        setServiceInfo(data);
      } catch (err) {
        console.error("Error fetching service details:", err);
        setError(err.message || "Error loading service details.");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [wsId]);

  const handleConfirmClick = async () => {
    setShowFirstDialog(false); // Close first dialog

    const newStatus = type === "รับงาน" ? 203 : 220; // 203: Accepted, 220: Rejected

    try {
      setLoading(true);
      const response = await fetch(`/api/walking-service/change-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus, walkingServiceId: wsId }),
      });

      if (!response.ok) {
        throw new Error(result.message || "Failed to update service status.");
      }

      if (type === "รับงาน") {
        setMessage("การรับงานสำเร็จ");
      } else {
        setMessage("การปฏิเสธงานสำเร็จ");
      }
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.message || "An error occurred while updating status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    router.push("/dog-walker/history");
  };

  return (
    <div>
      {/* First Confirmation Dialog */}
      <Dialog open={showFirstDialog} onOpenChange={setShowFirstDialog}>
        <DialogTrigger asChild>
          {type === "รับงาน" ? (
            <Button className="font-semibold text-lg p-5"
            disabled={loading}>รับงาน</Button>
          ) : (
            <Button className="font-semibold text-lg p-5"
            variant="destructive" disabled={loading}>ปฏิเสธ</Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex items-center">
            <DialogTitle>
              {type === "รับงาน" ? "ยืนยันการรับงาน" : "ยืนยันการปฏิเสธงาน"}
            </DialogTitle>
            <DialogDescription className="text-md text-black">
              {type === "รับงาน"
                ? "โปรดยืนยันการรับงานของท่านอีกครั้ง"
                : "โปรดยืนยันการปฏิเสธงานของท่านอีกครั้ง"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleConfirmClick} disabled={loading}>
              {loading ? "กำลังดำเนินการ..." : "ยืนยัน"}
            </Button>
            <DialogClose asChild>
              <Button variant="destructive">ยกเลิก</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <ConfirmationDialogs
        showSuccessDialog={showSuccessDialog}
        message={message}
        onSuccessClose={handleDialogClose}
      />
    </div>
  );
};

export default WalkerWalkConfirmation;
