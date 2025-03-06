"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";

const SetZonePage = ({params}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const unwrappedParams = React.use(params);
  const dwId = parseInt(unwrappedParams.dwId);

  const formMethods = useForm({
    defaultValues: {
      id: dwId,  // Dog walker ID
      password: "",
      tel: "",
      address: "",
      serviceAreas: [{ value: "" }], 
    },
  });

  const zones = [
    "เขตสายไหม", "เขตจตุจักร", "เขตหลักสี่", "เขตดอนเมือง", "เขตบางซื่อ",
    "เขตลาดพร้าว", "เขตสะพานสูง", "เขตบางเขน", "เขตหนองจอก", "เขตบางกะปิ",
    "เขตประเวศ", "เขตลาดกระบัง", "เขตบึงกุ่ม", "เขตคันนายาว", "เขตมีนบุรี",
    "เขตคลองสามวา", "เขตวัฒนา", "เขตสวนหลวง", "เขตพระโขนง", "เขตสาทร",
    "เขตคลองเตย", "เขตบางคอแหลม", "เขตปทุมวัน", "เขตบางรัก", "เขตยานนาวา",
    "เขตบางนา", "เขตบางพลัด", "เขตบางกอกน้อย", "เขตบางกอกใหญ่", "เขตตลิ่งชัน",
    "เขตทวีวัฒนา", "เขตจอมทอง", "เขตธนบุรี", "เขตคลองสาน", "เขตบางขุนเทียน", "เขตบางแค",
    "เขตหนองแขม", "เขตภาษีเจริญ", "เขตบางบอน", "เขตทุ่งครุ", "เขตราษฎร์บูรณะ"
  ];

  const { control, handleSubmit, register, setValue, watch } = formMethods;
  const { fields, append } = useFieldArray({ control, name: "serviceAreas" });

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("password", data.password);
    formData.append("tel", data.tel);
    formData.append("address", data.address);
    data.serviceAreas.forEach((zone) => formData.append("zone", zone.value));

    try {
      const response = await fetch("/api/setzone", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("บันทึกข้อมูลสำเร็จ!");
      } else {
        setMessage(result.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } catch (error) {
      console.error("API Error:", error);
      setMessage("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center bg-[#FFF8D6] p-6">
      <Label className="font-semibold text-3xl mb-4">ตั้งค่าเข้าสู่ระบบครั้งแรก</Label>
      <Card className="w-full max-w-2xl">
        <CardHeader className="-mb-3">
          <CardTitle className="font-semibold text-xl">ข้อมูลส่วนตัว</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Password */}
            <div>
              <Label htmlFor="password" className="font-semibold text-md">รหัสผ่านใหม่</Label>
              <Input type="password" placeholder="รหัสผ่านใหม่" {...register("password")} required />
            </div>

            {/* Phone Number */}
            <div>
              <Label htmlFor="tel" className="font-semibold text-md">เบอร์โทรศัพท์</Label>
              <Input type="text" placeholder="เบอร์โทรศัพท์" {...register("tel")} required />
            </div>

            {/* Address (Textarea) */}
            <div>
              <Label htmlFor="address" className="font-semibold text-md">ที่อยู่ปัจจุบัน</Label>
              <Textarea id="address" placeholder="กรอกที่อยู่ปัจจุบันของคุณ" rows={3} {...register("address")} required />
            </div>

            {/* Service Area Selection */}
            <div>
              <Label className="font-semibold text-md">เลือกเขตที่ต้องการให้บริการ</Label>
              {fields.map((field, index) => (
                <div key={field.id} className="mb-2">
                  <Select
                    onValueChange={(value) => setValue(`serviceAreas.${index}`, value)}
                  >
                    <SelectTrigger className="rounded-md bg-[#C6C6C6] text-white">
                      <SelectValue placeholder="เลือกเขต" />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map((zone, idx) => (
                        <SelectItem key={idx} value={zone}>
                          {zone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

              {/* Button to Add More Service Areas */}
              <Button type="button" variant="secondary" onClick={() => append({ value: "" })}>
                + เพิ่มเขต
              </Button>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <Button type="submit" variant="default" disabled={loading}>
                {loading ? "กำลังบันทึก..." : "ยืนยัน"}
              </Button>
              <Button type="button" variant="destructive">ยกเลิก</Button>
            </div>

            {/* Display API Response Messages */}
            {message && <p className="text-center mt-4 text-red-600">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetZonePage;
