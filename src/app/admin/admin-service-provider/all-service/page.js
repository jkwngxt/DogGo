import React from "react";
import { Button } from "@/components/ui/button";

const serviceProviders = [
  { name: "JA Pet 1", location: "บางรัก", phone: "096-512-3478", services: 2 },
  { name: "JA Pet 2", location: "บางรัก", phone: "096-512-3478", services: 2 },
  { name: "JA Pet 3", location: "บางรัก", phone: "096-512-3478", services: 2 },
  { name: "JA Pet 4", location: "บางรัก", phone: "096-512-3478", services: 2 },
];

const ServiceProviderPage = () => {
  return (
    <div className="min-h-screen bg-yellow-100 p-6">
      <div className="max-w-3xl mx-auto mt-4">
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
        
        <h2 className="mt-6 text-lg font-bold absolute">Service Provider</h2>
        <div className="flex flex-row justify-end mt-5">
            <Button variant="secondary">
            + เพิ่มบัญชี
            </Button>
        </div>
       
        <div className="mt-4 space-y-2">
          {serviceProviders.map((provider, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-white p-4 rounded shadow"
            >
              <span className="font-bold">{provider.name}</span>
              <span>{provider.location}</span>
              <span className="font-semibold">{provider.phone}</span>
              <span>จำนวน {provider.services} บริการ</span>
              <Button variant="secondary">
                แก้ไข
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderPage;
