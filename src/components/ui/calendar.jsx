"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

function Calendar(props) {
  return (
    <div className="p-3 bg-white rounded-lg shadow-sm">
      <DayPicker
        className="p-2"
        classNames={{
          months: "space-y-4",
          month: "space-y-4",
          caption: "flex justify-between items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          table: "w-full border-collapse",
          head_row: "flex w-full justify-between",
          head_cell: "text-muted-foreground text-center text-sm p-2 font-medium",
          row: "flex w-full justify-between my-1",
          cell: "p-0 text-center text-sm relative focus-within:relative focus-within:z-20",
          day: "h-9 w-9 p-0 font-normal hover:bg-gray-100 rounded-md",
          day_selected: "bg-blue-600 text-white hover:bg-blue-600",
          day_today: "border border-blue-500",
        }}
        components={{
          IconLeft: () => <ChevronLeft className="h-4 w-4" />,
          IconRight: () => <ChevronRight className="h-4 w-4" />,
        }}
        {...props}
      />
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };