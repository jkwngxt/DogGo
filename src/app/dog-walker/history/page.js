// หน้าหลัง dog walker กดรับ-ปฏิเสธงาน

"use client";

import React from "react";
import WorkDescription from "@/components/work-description";
import { Label } from "@/components/ui/label";
import Loading from "@/components/loading";
import NoWSFound from "@/components/no-ws-found"

export default function DogWalkerWorkPage() {
  const [walkingServices, setWalkingServices] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchWalkingServices = async () => {
    try {
        setIsLoading(true);
        const response = await fetch("/api/walking-service/service-detail", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
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

            const formatTime = (time) => {
              const pad = (num) => String(num).padStart(2, "0");
              return `${pad(time)}:00`;
            };

            const formatTel = (tel) => {
              const strTel = String(tel).replace(/\D/g, ""); // remove non-numeric characters
          
              if (strTel.length === 10) {
                  return `${strTel.slice(0, 3)}-${strTel.slice(3, 6)}-${strTel.slice(6)}`;
              }
              return tel; // return original if not 10 digits
          };
        
            const formattedServices = data.services
              .filter(service => service.status === 202) // filter only status 202: awaiting response
              .map((service) => ({
              id: service.serviceId || service.id,
              userName: service.userName || "Unknown",
              wsDate: formatDate(service.serviceDate || service.date),
              startHour: formatTime(service.startHour),
              endHour: formatTime(service.endHour),
              userTel: formatTel(service.userTel) || "Unknown",
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

  if (isLoading) return <Loading />;
    
  if (error) return <p className="p-2 text-red-600">Error: {error}</p>;

  if (walkingServices.length === 0) {
    return <NoWSFound />;
  }

  return (
    <div className="min-h-screen bg-yellow-100 p-6">
      <div className="max-w-3xl mx-auto mt-4">
        <Label className="text-3xl font-semibold">งานของฉัน</Label>
        {/* Work List using WorkDescription */}
        <div className="mt-4 space-y-2 font-semibold">
        {walkingServices.map((service, index) => (
          <WorkDescription
            key={service.id || index}
            id={service.id}
            po_username={service.userName}
            ws_date={service.wsDate}
            startTime={service.startHour} 
            endTime={service.endHour}  
            po_tel={service.userTel}
          />
        ))}
        </div>
      </div>
    </div>
  );
}