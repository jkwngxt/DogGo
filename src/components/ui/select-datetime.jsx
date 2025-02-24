'use client';

import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
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

const FormSchema = z.object({
  startDate: z.date({
    required_error: "กรุณาใส่วันที่",
  }),
  startTime: z.string({
    required_error: "กรุณาใส่เวลาเริ่มต้น",
  }),
  endTime: z.string({
    required_error: "กรุณาใส่เวลาสิ้นสุด",
  }),
}).refine((data) => {
  const startDateTime = new Date(
    data.startDate.setHours(
      parseInt(data.startTime.split(':')[0]),
      parseInt(data.startTime.split(':')[1])
    )
  );
  const endDateTime = new Date(
    data.startDate.setHours(
      parseInt(data.endTime.split(':')[0]),
      parseInt(data.endTime.split(':')[1])
    )
  );
  return endDateTime > startDateTime;
}, {
  message: "End date/time must be after start date/time",
  path: ["endDate"]
});

const TimePickerSelect = ({ value, onChange }) => {
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(timeString);
    }
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
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      startTime: "09:00",
      endTime: "17:00",
    },
  });

  function onSubmit(data) {
    console.log(data);
    // Handle your submit logic here
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-4">
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-[180px] pl-3 text-left font-normal bg-white"
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>เลือกวันที่</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <TimePickerSelect {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <h1>ถึง</h1>
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <TimePickerSelect {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button variant="secondary" type="submit">ค้นหา</Button>
      </form>
    </Form>
  );
};

export default DateTimeRangePicker;