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
import { redirect } from "next/navigation";

const ClientDogSelector = ({ dogs }) => {
  const [selectedDogs, setSelectedDogs] = useState({});

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
          {dogs && dogs.map((dog) => (
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
              ))}
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button
           onClick={()=>redirect('/pet-owner/billing')}
          >ยืนยัน</Button>
          <DialogClose asChild>
            <Button variant="destructive">ยกเลิก</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDogSelector;
