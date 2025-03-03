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

const ClientDogSelector = ({ dogs, searchTime, dogWalker }) => {
  const [selectedDogs, setSelectedDogs] = useState({});
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

  const handleDogChange = (dog) => {
    setSelectedDogs({
      ...selectedDogs,
      [dog]: !selectedDogs[dog],
    });
  };

  const handleConfirm = () => {
    // Get the selected dogs (เลือกเฉพาะตัวที่ถูกเลือก)
    const selectedDogIds = Object.keys(selectedDogs)
        .filter(dogId => selectedDogs[dogId])
        .map(dogId => parseInt(dogId)); // แปลงเป็น integer

    // เก็บรายชื่อสุนัขที่ถูกเลือกเพื่อแสดงผล
    const selectedDogNames = dogs
        .filter(dog => selectedDogs[dog.id])
        .map(dog => dog.name);

    // เก็บข้อมูลลง sessionStorage แทนการใช้ URL parameters
    const bookingData = {
      startTime: searchTime?.startTimeSearch,
      endTime: searchTime?.endTimeSearch,
      date: searchTime?.dateSearch,
      dwId: dogWalker?.id,
      dwName: dogWalker?.name,
      dwTel: dogWalker?.tel,
      dogIds: selectedDogIds, // เก็บ IDs สำหรับส่งไป API
      dogNames: selectedDogNames // เก็บชื่อสำหรับแสดงผล
    };

    // เก็บข้อมูลลง sessionStorage
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

    // Navigate to billing page โดยไม่ส่งพารามิเตอร์ผ่าน URL
    router.push(`/pet-owner/billing`);
  };

  return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>เลือก</Button>
        </DialogTrigger>
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
                            onClick={() => handleDogChange(dog.id)}
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
  );
};

export default ClientDogSelector;