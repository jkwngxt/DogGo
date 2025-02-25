'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
} from "@/components/dialog";

const ClientDogSelector = ({ breeds, onSelect, open, onClose }) => {
  const [selectedBreeds, setSelectedBreeds] = useState({});

  // Initialize selectedBreeds when the component mounts or breeds change
  useEffect(() => {
    if (breeds && breeds.length > 0) {
      setSelectedBreeds({
        [breeds[0]]: true,
        ...breeds.slice(1).reduce((acc, breed) => ({ ...acc, [breed]: false }), {})
      });
    }
  }, [breeds]);

  const handleBreedChange = (breed) => {
    setSelectedBreeds({
      ...selectedBreeds,
      [breed]: !selectedBreeds[breed]
    });
  };

  const handleConfirm = () => {
    const selected = Object.entries(selectedBreeds)
      .filter(([_, isSelected]) => isSelected)
      .map(([breed]) => breed);
    
    if (onSelect) {
      onSelect(selected);
    }
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 border-0 max-w-md">
        <Card className="w-full border-0 shadow-none">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-xl font-bold text-center">เลือกสุนัขที่ต้องการ</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {breeds && breeds.map((breed) => (
                <div key={breed} className="flex items-center justify-between p-2 border rounded">
                  <Label 
                    htmlFor={breed} 
                    className="flex-grow cursor-pointer py-2"
                    onClick={() => handleBreedChange(breed)}
                  >
                    {breed}
                  </Label>
                  <Checkbox 
                    id={breed} 
                    checked={selectedBreeds[breed] || false} 
                    onCheckedChange={() => handleBreedChange(breed)}
                    className="h-5 w-5"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-6 justify-center">
              <Button 
                onClick={handleConfirm} 
                className="bg-blue-500 hover:bg-blue-600 text-white px-6"
              >
                ยืนยัน
              </Button>
              <Button 
                onClick={onClose} 
                variant="destructive" 
                className="bg-red-500 hover:bg-red-600 text-white px-6"
              >
                ยกเลิก
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDogSelector;