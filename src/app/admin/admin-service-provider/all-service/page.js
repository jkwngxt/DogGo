import React from "react";
import { Button } from "@/components/ui/button";
import ServiceDescription from "@/components/service-description";

const serviceProviders = [
  {
    service: "JA Pet 1",
    detail: "ให้บริการอาบน้ำตัดขน",
    price: "500 บาท",
    status: "เปิดให้บริการ",
  },
  {
    service: "JA Pet 2",
    detail: "บริการฝากเลี้ยงสุนัข",
    price: "1,200 บาท",
    status: "เปิดให้บริการ",
  },
  {
    service: "JA Pet 3",
    detail: "ตรวจสุขภาพสัตว์เลี้ยง",
    price: "800 บาท",
    status: "ปิดปรับปรุง",
  },
  {
    service: "JA Pet 4",
    detail: "บริการทำหมันแมว",
    price: "1,500 บาท",
    status: "เปิดให้บริการ",
  },
];

const ServiceProviderPage = () => {
  return (
    <div className="min-h-screen bg-yellow-100 p-6">
      <div className="max-w-3xl mx-auto mt-4">
        {/* Search Bar */}
        <div className="flex flex-row">
          <input
            type="text"
            placeholder="ค้นหา Service Provider"
            className="w-full p-2 border rounded-xl mr-2 shadow-lg"
          />
          <Button variant="secondary" className="mt-1 shadow-md">
            ค้นหา
          </Button>
        </div>

        {/* Title & Add Button */}
        <h2 className="mt-6 text-lg font-bold absolute">Service Provider</h2>
        <div className="flex flex-row justify-end mt-5">
          <Button variant="secondary">+ เพิ่มบัญชี</Button>
        </div>

        {/* Service List using ServiceDescription */}
        <div className="mt-4 space-y-2">
          {serviceProviders.map((provider, index) => (
            <ServiceDescription
              key={index}
              service={provider.service}
              detail={provider.detail}
              price={provider.price}
              status={provider.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderPage;
