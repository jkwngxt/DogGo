"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import DogTable from "@/components/dog-table";
import Loading from "@/components/loading";

export default function DogWalkDescription({ params }) {
  // Sample fallback data (will only be used if API fails)
  const fallbackInfo = {
    pet_owner: "Pet Owner 1",
    dw_zone: "บางรัก",
    u_address: "7/222 แขวงอรุณอมรินทร์ เขตบางรัก กรุงเทพมหานคร 10700",
    u_tel: "0121234567",
    dw_username: "Dog Walker 1",
    ws_date: "2025-02-19",
    startTime: "10:00",
    endTime: "12:00",
    dw_tel: "5551234567",
    dogs: [
      {
        d_id: 1,
        d_name: "มะลิ",
        d_breed: "บางแก้ว",
      },
      {
        d_id: 2,
        d_name: "ลัคกี้",
        d_breed: "ชิวาวา",
      },
      {
        d_id: 3,
        d_name: "บ๊อบ",
        d_breed: "โกลเด้นรีทรีฟเวอร์",
      },
    ],
  };

  // Format date (moved outside of render function)
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
        console.log("Fetching walking service details for wsId:", wsId);

        const response = await fetch(`/api/walking-service/service-detail/${wsId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // If response is not OK, read the error message
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("API Response:", data);
  
        if (data.success) {
          setServiceInfo(data);
        } else {
          setError(data.message || "Failed to load service details.");
        }
      } catch (err) {
        console.error("Error fetching walking service details:", err);
        setError(err.message || "An error occurred while loading the service details.");
      } finally {
        setLoading(false);
      }
    }

    fetchServiceDetails();
  }, [wsId]);

  if (loading) return <Loading />;
  
  // Use either API data or fallback data
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
  } 

  // Format the date from ws_date
  const formattedDate = formatDate(info.ws_date);

  if (error) return <p className="text-red-600">{error}</p>;

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
                  <span className="font-bold">ชื่อลูกค้า:</span>
                  <span>{info.pet_owner}</span>
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
                </div>
                <div className="flex space-x-2">
                  <span className="font-bold">เวลาที่จอง:</span>
                  <div className="flex space-x-1">
                    <span>{info.startTime}</span>
                    <span>-</span>
                    <span>{info.endTime}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className="font-bold">เบอร์โทรติดต่อ:</span>
                  <span>{info.u_tel}</span>
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
          </div>
        </Card>
      </div>
    </div>
  );
}