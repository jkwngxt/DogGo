"use client";

import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ServiceDescription from "@/components/service-description";

const EditService = () => {
  const [inputRows, setInputRows] = useState([{ id: 1 }]);

  const addInputRow = () => {
    setInputRows([...inputRows, { id: Date.now() }]); // Unique ID for each row
  };

  const onSubmit = async (data) => {
    console.log("Form Submitted:", data);
    // TODO: Add API call to submit form data
  };

  return (
    <div className="flex flex-col min-h-screen items-center bg-[#FFF8D6]">
      <h2 className="text-3xl font-semibold text-center mt-10">เพิ่ม/แก้ไขบริการของร้านค้า</h2>

      <div className="w-9/12 bg-white p-6 rounded-lg shadow-md mt-6">
        {inputRows.map((row) => (
          <InputRow key={row.id} />
        ))}

        <div className="mt-4 flex">
          <Button variant="secondary" onClick={addInputRow}>
            + เพิ่มบริการ
          </Button>
        </div>

        <div className="mt-4">
            <Label className="font-semibold text-lg">รายการบริการของร้าน</Label>
        </div>

        <div className="grid grid-cols-5 mt-4">
          <div className="ml-20">
            <Label className="font-semibold">ชื่อบริการ</Label>
          </div>
          <div className="ml-2">
            <Label className="font-semibold">ประเภทบริการ</Label>
          </div>
          <div className="ml-3">
            <Label className="font-semibold">ราคาบริการ</Label>
          </div>
          <div className="-ml-2">
            <Label className="font-semibold">การมองเห็น</Label>
          </div>
        </div>

        <ServiceDescription
          service="อาบน้ำตัดขนแบบพิเศษ"
          detail="ตัดขน"
          price="500 บาท"
          status="มองเห็น"
        />

        {/* Buttons */}
        <div className="col-span-2 flex justify-center gap-4 mt-6">
          <Button type="submit" variant="default">
            เสร็จสิ้น
          </Button>
          <Button type="button" variant="destructive">
            ยกเลิก
          </Button>
        </div>
      </div>
    </div>
  );
};

const InputRow = () => {
  const form = useForm({
    defaultValues: {
      serviceName: "",
      serviceCategory: "",
      details: "",
      price: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => console.log("Row Submitted:", data))} className="flex flex-col">
        <div className="grid grid-cols-2 gap-4 mt-2">
          {/* Service Name */}
          <FormField
            control={form.control}
            name="serviceName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">ชื่อบริการ</FormLabel>
                <FormControl>
                  <Input className="rounded-xl" placeholder="ชื่อบริการ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Service Category */}
          <FormField
            control={form.control}
            name="serviceCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">ประเภทบริการ</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full rounded-xl bg-[#C6C6C6] text-white placeholder:text-white">
                      <SelectValue placeholder="ประเภทบริการ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bath">อาบน้ำ</SelectItem>
                      <SelectItem value="grooming">กรูมมิ่ง ตัดแต่งขน</SelectItem>
                      <SelectItem value="health">แพ็กเกจตรวจสุขภาพ ฉีดวัคซีน</SelectItem>
                      <SelectItem value="petCare">บริการรับฝากสัตว์เลี้ยง</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Service Details */}
          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem className="flex flex-col mt-2">
                <FormLabel className="font-semibold">รายละเอียดบริการ</FormLabel>
                <FormControl>
                <textarea className="pt-1 pl-1 rounded-xl bg-[#C6C6C6] placeholder:text-white h-16" placeholder="รายละเอียดบริการ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col">
          {/* Service Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">ราคาบริการ</FormLabel>
                <FormControl>
                  <Input className="rounded-xl" placeholder="ราคาบริการ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           {/* Visibility Selection (Normal Radio Buttons) */}
            <div className= "mt-2 ml-1 flex flex-row">
              <FormLabel className="font-semibold text-md mr-3">การมองเห็น</FormLabel>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="visible"
                    {...form.register("visibility")}
                    className="w-4 h-4"
                  />
                  <span>มองเห็น</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="hidden"
                    {...form.register("visibility")}
                    className="w-4 h-4"
                  />
                  <span>ไม่มองเห็น</span>
                </label>
              </div>
            </div>
          </div>
        </div>  
      </form>
    </Form>
  );
};

export default EditService;
