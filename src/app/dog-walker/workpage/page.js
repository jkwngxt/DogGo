import React from "react";
import WorkDescription from "@/components/work-description";
import { Label } from "@/components/ui/label";

const allWork = [
  {
    dw_username: "Pet Owner 1",
    startTime: "10:00",
    endTime: "12:00",
    dw_tel: "091-234-5678",
    ws_status: 0,
  },
  {
    dw_username: "Pet Owner 2",
    startTime: "10:00",
    endTime: "12:00",
    dw_tel: "092-345-6789",
    ws_status: 0,
  },
  {
    dw_username: "Pet Owner 3",
    startTime: "11:00",
    endTime: "13:00",
    dw_tel: "093-456-7890",
    ws_status: 0,
  },
  {
    dw_username: "Pet Owner 4",
    startTime: "11:00",
    endTime: "13:00",
    dw_tel: "094-567-8901",
    ws_status: 0,
  },
];

const DogWalkerWorkPage = () => {
  return (
    <div className="min-h-screen bg-yellow-100 p-6">
      <div className="max-w-3xl mx-auto mt-4">
        <Label className="text-3xl font-semibold">งานของฉัน</Label>
        {/* Work List using WorkDescription */}
        <div className="mt-4 space-y-2 font-semibold">
          {allWork.map((work, index) => (
            <WorkDescription
              key={index}
              dw_username={work.dw_username}
              startTime={work.startTime}
              endTime={work.endTime}
              dw_tel={work.dw_tel}
              ws_status={work.ws_status}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DogWalkerWorkPage;
