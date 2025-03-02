'use client';

import React, { useState } from 'react';
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Confirmation from "@/components/confirmation-dialogs";

const TimePickerSelect = ({ value, onChange }) => {
  const timeOptions = [];
  for (let hour = 9; hour < 19; hour++) {
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    timeOptions.push(timeString);
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-24">
        <SelectValue placeholder="Time" />
      </SelectTrigger>
      <SelectContent>
        {timeOptions.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const DateTimeRangePicker = () => {
  const [confirmation, setConfirmation] = useState({ open: false, message: "", status: "fail" });
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  function onSubmit() {
    console.log("Selected Data:", { startDate, startTime, endTime });
  }

  return (
    <>
      <form onSubmit={onSubmit} className="flex items-start gap-4">
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[180px] pl-3 text-left font-normal bg-white"
              >
                {startDate ? format(startDate, "PPP") : <span>เลือกวันที่</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <TimePickerSelect value={startTime} onChange={setStartTime} />
          </div>
        </div>
        <h1 className='py-2'>ถึง</h1>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <TimePickerSelect value={endTime} onChange={setEndTime} />
          </div>
        </div>
        <Button variant="secondary" type="submit">ค้นหา</Button>
      </form>
      <Confirmation {...confirmation} onOpenChange={() => setConfirmation({ ...confirmation, open: false })} action={() => setConfirmation({ ...confirmation, open: false })} />
    </>
  );
};

export default DateTimeRangePicker;
