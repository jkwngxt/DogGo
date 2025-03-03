"use client";

import { useForm, useFieldArray } from "react-hook-form";
import React, { useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Validation Schema
const schema = yup.object().shape({
  services: yup.array().of(
    yup.object().shape({
      serviceName: yup.string().required("กรุณากรอกชื่อบริการ"),
      serviceCategory: yup.string().required("กรุณาเลือกประเภทของบริการ"),
      details: yup.string().required("กรุณากรอกรายละเอียดบริการ"),
      price: yup.string().required("กรุณากรอกราคาของบริการ"),
      visibility: yup.string().required("กรุณาเลือกการมองเห็น"),
    })
  ),
});

const AddService = () => {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      services: [{ serviceName: "", serviceCategory: "", details: "", price: "", visibility: "visible" }],
    },
  });

  const { control, handleSubmit } = form;
  const { fields, append } = useFieldArray({ control, name: "services" });

  const onSubmit = async (data) => {
    console.log("Form Submitted:", data);
    // TODO: Add API call to submit form data
  };

  return (
    <div className="flex flex-col min-h-screen items-center bg-[#FFF8D6]">
      <h2 className="text-3xl font-semibold text-center mt-10">
        สร้างบัญชี Service Provider - บริการของร้านค้า
      </h2>

      <div className="w-9/12 bg-white p-6 rounded-lg shadow-md mt-6">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {fields.map((field, index) => (
              <InputRow key={field.id} form={form} index={index} />
            ))}

            <div className="mt-4 flex">
              <Button variant="secondary" onClick={() => append({ serviceName: "", serviceCategory: "", details: "", price: "", visibility: "visible" })}>
                + เพิ่มบริการ
              </Button>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <Button type="submit" variant="default">
                บันทึก
              </Button>
              <Button type="button" variant="destructive">
                ยกเลิก
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

const InputRow = ({ form, index }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-2">
      {/* Service Name */}
      <FormField
        control={form.control}
        name={`services.${index}.serviceName`}
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
        name={`services.${index}.serviceCategory`}
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

      {/* Service Details */}
      <FormField
        control={form.control}
        name={`services.${index}.details`}
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
            name={`services.${index}.price`}
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
           <FormField
            control={form.control}
            name={`services.${index}.visibility`}
            render={({ field }) => (
              <FormItem>
                <div className= "mt-2 ml-1 flex flex-row">
                <FormLabel className="font-semibold text-md mr-3">การมองเห็น</FormLabel>
                <FormControl>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2">
                      <input type="radio" value="visible" {...field} className="w-4 h-4" />
                      <span>มองเห็น</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" value="hidden" {...field} className="w-4 h-4" />
                      <span>ไม่มองเห็น</span>
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
                </div>
              </FormItem>
            )}
          />
          </div>
    </div>
  );
};

export default AddService;
