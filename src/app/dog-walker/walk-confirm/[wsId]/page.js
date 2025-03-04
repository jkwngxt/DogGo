"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import WalkerWalkConfirmation from "@/components/walker-walk-confirmation";
import DogTable from "@/components/dog-table";
import Loading from "@/components/loading";

export default function DogWalkConfirm({ params }) {
   const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
  
    const unwrappedParams = React.use(params);
    const wsId = parseInt(unwrappedParams.wsId);
  
    const [serviceInfo, setServiceInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchServiceDetails = async () => {
        if (!wsId) {
          setError("Missing service ID.");
          setLoading(false);
          return;
        }
    
        try {
          setLoading(true);
          setError(null); 
    
          const response = await fetch(`/api/walking-service/service-detail/${wsId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
    
          const data = await response.json(); 
    
          if (!data.success) { 
            setError(data.message || "An error occurred while loading the service details.");
          }
    
          setServiceInfo(data);
        } catch (err) {
          console.error("Error fetching walking service details:", err);
          setError(err.message || "An error occurred while loading the service details.");
        } finally {
          setLoading(false);
        }
      };
    
      fetchServiceDetails();
    }, [wsId]);
    
    if (loading) return <Loading />;
    
    if (error) return <p className="p-2 text-red-600">Error: {error}</p>;
  
    const info = {
      pet_owner: serviceInfo.user.name || "N/A",
      dw_zone: serviceInfo.user.zone || "N/A",
      u_address: serviceInfo.user.address || "N/A",
      u_tel: serviceInfo.user.tel || "N/A",
      dw_username: serviceInfo.dw.name || "N/A",
      ws_date: serviceInfo.service.date || "N/A",
      startTime: serviceInfo.service.startTime + (":00")|| "N/A",
      endTime: serviceInfo.service.endHour + (":00")|| "N/A",
      dw_tel: serviceInfo.dw.tel || "N/A",
      dogs: serviceInfo.service.dogs || [],
    };
  
    // Format the date from ws_date
    const formattedDate = formatDate(info.ws_date);
  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col px-10 items-center">
        <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
          รายละเอียดงาน
        </h1>
        <Card className="w-[100%] sm:w-[60%] md:w-[60%] lg:w-[80%] p-6 h-auto flex flex-col justify-between">
          {/* Content Section */}
          <div className="flex-grow flex flex-col space-y-4 items-center">
            <div className="space-y-4 w-[60%] text-left">
              <h1 className="flex text-3xl font-bold">ข้อมูลลูกค้า</h1>
            </div>
            <div className="flex justify-between w-[60%] px-10">
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <span className="font-bold">ชื่อพนักงาน:</span>
                  <span>{info.dw_username}</span>
                </div>
                <div className="flex space-x-2">
                  <span className="font-bold">เขตที่อยู่:</span>
                  <span>{info.dw_zone}</span>
                </div>
                <div className="flex space-x-2">
                  <span className="font-bold">ที่อยู่:</span>
                  <span className="w-[60%]">{info.u_address}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <span className="font-bold">วันที่:</span>
                  <span>{formattedDate}</span>
                  <div className="flex-row space-x-1"></div>
                </div>
                <div className="flex space-x-2">
                  <span className="font-bold">เวลาที่จอง:</span>
                  <div className="flex-row space-x-1">
                    <span>{info.startTime}</span>
                    <span>-</span>
                    <span>{info.endTime}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className="font-bold">เบอร์โทรติดต่อ:</span>
                  <span>{info.dw_tel}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 w-[60%] text-left">
              <h1 className="flex text-3xl font-bold">ข้อมูลผู้รับผิดชอบ</h1>
            </div>
            <div className="flex justify-between w-[60%] px-10">
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <span className="font-bold">ชื่อพนักงาน:</span>
                  <span>{info.dw_username}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <span className="font-bold">เบอร์โทรติดต่อ:</span>
                  <span>{info.dw_tel}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 w-[60%] px-16 text-left">
              <span className="font-bold">รายการสุนัข</span>
              <DogTable dogs={info.dogs} />
            </div>
            {/* Button Section */}
            <div className="flex flex-row space-x-4 justify-center">
              <WalkerWalkConfirmation type="รับงาน" />
              <WalkerWalkConfirmation type="ปฏิเสธ" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
