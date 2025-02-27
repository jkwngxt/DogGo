import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";
import PetOwnerNav from "@/components/nav-bar/nav-pet-owner";
import { Textarea } from "@/components/ui/textarea";
import Rating from "@/components/rating";

export default function Review() {
  return (
    <>
      <PetOwnerNav />
      <div className="p-4 space-y-4">
        <div className="flex flex-col px-10 items-center">
          <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
            ให้คะแนนการใช้บริการ
          </h1>
          <Card className="w-[100%] sm:w-[60%] md:w-[60%] lg:w-[80%] p-6 py-10 h-[70vh] flex flex-col justify-between items-center">
            {/* Content */}
            <div className="space-y-4 w-[80%] text-left flex-grow">
              <h2 className="font-bold text-md">ให้คะแนน</h2>
              <Rating />
              <h2 className="font-bold text-md">เขียนรีวิว</h2>
              <Textarea className="h-[200px]" placeholder="เขียนรีวิว" />
            </div>

            {/* Buttons at the bottom */}
            <div className="flex flex-row space-x-4 justify-center">
              <Button>เสร็จสิ้น</Button>
              <Button variant="destructive">ยกเลิก</Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
