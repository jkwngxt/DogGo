"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import ConfirmationDialogs from "@/components/confirmation-dialogs";

const ClientDogSelector = ({ dogs, searchTime, dogWalker }) => {
  const [selectedDogs, setSelectedDogs] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Initialize selectedDogs when the component mounts or dogs change
  useEffect(() => {
    if (dogs && dogs.length > 0) {
      // สร้าง object ด้วย id เป็น key เพื่อใช้ในการ track การเลือก
      const initialSelected = {};
      dogs.forEach(dog => {
        initialSelected[dog.id] = false;
      });
      setSelectedDogs(initialSelected);
    }
  }, [dogs]);

  const handleDogChange = (dogId) => {
    setSelectedDogs({
      ...selectedDogs,
      [dogId]: !selectedDogs[dogId],
    });
  };

  const handleConfirm = () => {
    // ตรวจสอบว่ามีการเลือกสุนัขอย่างน้อย 1 ตัวหรือไม่
    const hasSelectedDogs = Object.values(selectedDogs).some(value => value);

    if (!hasSelectedDogs) {
      setMessage("กรุณาเลือกสุนัขอย่างน้อย 1 ตัว");
      setShowErrorDialog(true);
      return;
    }

    // ตรวจสอบความถูกต้องของข้อมูลการค้นหา
    if (!searchTime || !searchTime.startTimeSearch || !searchTime.endTimeSearch || !searchTime.dateSearch) {
      setMessage("ข้อมูลการจองไม่ครบถ้วน กรุณาทำรายการใหม่");
      setShowErrorDialog(true);
      return;
    }

    // ตรวจสอบความถูกต้องของข้อมูล Dog Walker
    if (!dogWalker || !dogWalker.id) {
      setMessage("ข้อมูล Dog Walker ไม่ถูกต้อง กรุณาทำรายการใหม่");
      setShowErrorDialog(true);
      return;
    }

    // Get the selected dogs (เลือกเฉพาะตัวที่ถูกเลือก)
    const selectedDogIds = Object.keys(selectedDogs)
        .filter(dogId => selectedDogs[dogId])
        .map(dogId => parseInt(dogId)); // แปลงเป็น integer

    // เก็บรายชื่อสุนัขที่ถูกเลือกเพื่อแสดงผล
    const selectedDogNames = dogs
        .filter(dog => selectedDogs[dog.id])
        .map(dog => dog.name);

    // คำนวณราคา: 250 บาทต่อชั่วโมงต่อตัว
    const hours = searchTime.endTimeSearch - searchTime.startTimeSearch;
    const totalPrice = hours * 250 * selectedDogIds.length;

    // เก็บข้อมูลลง sessionStorage แทนการใช้ URL parameters
    const bookingData = {
      startTime: searchTime.startTimeSearch,
      endTime: searchTime.endTimeSearch,
      date: searchTime.dateSearch,
      dwId: dogWalker.id,
      dwName: dogWalker.name,
      dwTel: dogWalker.tel || 'ไม่ระบุ',
      dogIds: selectedDogIds, // เก็บ IDs สำหรับส่งไป API
      dogNames: selectedDogNames, // เก็บชื่อสำหรับแสดงผล
      totalPrice: totalPrice
    };

    // เก็บข้อมูลลง sessionStorage
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

    // ปิด Dialog
    setShowDialog(false);

    // Navigate to billing page โดยไม่ส่งพารามิเตอร์ผ่าน URL
    router.push(`/pet-owner/billing`);
  };

  const handleOpenDialog = () => {
    if (dogs && dogs.length > 0) {
      setShowDialog(true);
    } else {
      setMessage("ไม่พบข้อมูลสุนัขของคุณ กรุณาเพิ่มสุนัขก่อนทำการจอง");
      setShowErrorDialog(true);
    }
  };

  const handleDialogClose = () => {
    setShowErrorDialog(false);
  };

  return (
      <>
        <Button onClick={handleOpenDialog} disabled={!dogs || dogs.length === 0}>
          เลือก
        </Button>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="flex items-center">
              <DialogTitle>เลือกสุนัขที่ต้องการ</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                {dogs && dogs.length > 0 ? (
                    dogs.map((dog) => (
                        <div key={dog.id} className="flex items-center justify-between p-2 border rounded">
                          <Label
                              htmlFor={`dog-${dog.id}`}
                              className="flex-grow cursor-pointer py-2"
                          >
                            {dog.name}
                          </Label>
                          <Checkbox
                              id={`dog-${dog.id}`}
                              checked={selectedDogs[dog.id] || false}
                              onCheckedChange={() => handleDogChange(dog.id)}
                              className="h-5 w-5"
                          />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">ไม่พบข้อมูลสุนัข</p>
                )}
              </div>
            </div>
            <DialogFooter className="sm:justify-center">
              <Button
                  onClick={handleConfirm}
                  disabled={!Object.values(selectedDogs).some(value => value)}
              >
                ยืนยัน
              </Button>
              <DialogClose asChild>
                <Button variant="destructive">ยกเลิก</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfirmationDialogs
            showErrorDialog={showErrorDialog}
            message={message}
            onErrorClose={handleDialogClose}
        />
      </>
  );
};

export default ClientDogSelector;