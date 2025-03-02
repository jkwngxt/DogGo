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
      setSelectedDogs(
          dogs.reduce((acc, dog) => ({ ...acc, [dog]: false }), {})
      );
    }
  }, [dogs]);

  const handleDogChange = (dog) => {
    setSelectedDogs({
      ...selectedDogs,
      [dog]: !selectedDogs[dog],
    });
  };

  const handleConfirm = () => {
    // Get the selected dogs
    const selectedDogsList = Object.keys(selectedDogs).filter(
        (dog) => selectedDogs[dog]
    );

    // Construct the URL with query parameters
    const queryParams = new URLSearchParams();

    // Add searchTime parameters if they exist
    if (searchTime) {
      if (searchTime.startTimeSearch) queryParams.append('startTime', searchTime.startTimeSearch);
      if (searchTime.endTimeSearch) queryParams.append('endTime', searchTime.endTimeSearch);
      if (searchTime.dateSearch) queryParams.append('date', searchTime.dateSearch);
    }

    // Add dog walker information if it exists
    if (dogWalker) {
      if (dogWalker.id) queryParams.append('dwId', dogWalker.id);
      if (dogWalker.name) queryParams.append('dwName', dogWalker.name);
      if (dogWalker.tel) queryParams.append('dwTel', dogWalker.tel);
    }

    // Add selected dogs
    queryParams.append('dogs', JSON.stringify(selectedDogsList));

    // Navigate to billing page with parameters
    router.push(`/pet-owner/billing?${queryParams.toString()}`);
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
                      <div key={dog} className="flex items-center justify-between p-2 border rounded">
                        <Label
                            htmlFor={dog}
                            className="flex-grow cursor-pointer py-2"
                            onClick={() => handleDogChange(dog)}
                        >
                          {dog}
                        </Label>
                        <Checkbox
                            id={dog}
                            checked={selectedDogs[dog] || false}
                            onCheckedChange={() => handleDogChange(dog)}
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