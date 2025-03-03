"use client"; 

import * as React from "react";
import { Card } from "@/components/ui/card";
import HistoryDogWalker from "@/components/history-dog-walker";
import CouponCard from "@/components/coupon-card";

export default function page() {
  const [walkingServices, setWalkingServices] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  
  const fetchWalkingServices = async () => {
    try {
        setIsLoading(true);
        const response = await fetch("/api/walking-service/service-detail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch walking services: ${response.status}`);
        }

        const data = await response.json();
        console.log("Full API Response:", JSON.stringify(data, null, 2));

        if (data.success && Array.isArray(data.services)) {
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = String(date.getFullYear());
                return `${day}/${month}/${year}`;
            };

            const formatTimeRange = (startHour, endHour) => {
                const pad = (num) => String(num).padStart(2, "0");
                return `${pad(startHour)}:00 - ${pad(endHour)}:00`;
            };

            const formattedServices = data.services.map(service => ({
                id: service.serviceId,
                ws_date: formatDate(service.serviceDate), // dd/mm/yy
                timeRange: formatTimeRange(service.startHour, service.endHour), // hh:mm - hh:mm
                ws_status: service.status,
                dw_username: service.walkerName,
                user_name: service.userName,
                rating: service.isReview ? 5 : null 
            }));

            setWalkingServices(formattedServices);
        } else {
            console.error("Unexpected API Response Structure:", data);
            setError("Invalid data format received from API");
        }
    } catch (error) {
        console.error("Error fetching walking services:", error);
        setError("Failed to load walking services. Please try again later.");
    } finally {
        setIsLoading(false);
    }
};
  
  React.useEffect(() => {
    fetchWalkingServices();
  }, []);

  const handleStatusUpdate = (id, newStatus) => {
    setWalkingServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, ws_status: newStatus } : service
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col p-6 space-y-4 items-center justify-center">
        <div className="w-9/12">
          <h1 className="text-left text-3xl font-bold text-gray-900 mb-4">
            รายการและสถานะบริการจูงสุนัข
          </h1>
          <Card className="p-6 h-auto space-y-4">
            {walkingServices.length > 0 ? (
              walkingServices.map((service, index) => (
                <HistoryDogWalker
                key={index}
                userImage={service.userImage}
                dw_username={service.dw_username}
                ws_date={service.ws_date}
                timeRange={service.timeRange}
                ws_status={service.ws_status}
                rating={service.rating}
                walkingServiceId={service.id}
                onStatusUpdate={handleStatusUpdate}
              />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                ไม่พบรายการบริการจูงสุนัข
              </div>
            )}
          </Card>
        </div>

        <div className="w-9/12">
          <h1 className="text-left text-3xl font-bold text-gray-900 mb-4">
            คูปองของฉัน
          </h1>
          <Card className="p-6 h-auto space-y-4">
            {/* Add your coupon content here */}
            <CouponCard
              c_id="CP2314587"
              sp_name="JA Pet 1"
              s_name="ตัดขนสัตว์แบบพิเศษ"
              s_type="กรูมมิ่ง ตัดแต่งขน"
              s_price={500}
              c_status="ใช้"
            />

            <CouponCard
              c_id="CP2314587"
              sp_name="JA Pet 1"
              s_name="ตัดขนสัตว์แบบพิเศษ"
              s_type="กรูมมิ่ง ตัดแต่งขน"
              s_price={500}
              c_status="รีวิว"
            />

            <CouponCard
              c_id="CP2314587"
              sp_name="JA Pet 1"
              s_name="ตัดขนสัตว์แบบพิเศษ"
              s_type="กรูมมิ่ง ตัดแต่งขน"
              s_price={500}
              c_status="สำเร็จ"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
