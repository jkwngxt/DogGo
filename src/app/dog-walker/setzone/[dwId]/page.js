"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const SetZonePage = ({params}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const [showConfirmPopover, setShowConfirmPopover] = useState(false);
  const [showResultPopover, setShowResultPopover] = useState(false);
  const [resultStatus, setResultStatus] = useState(null); // 'success' or 'failure'
  const formData = useRef(null);

  const storedId = typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const dwId = storedId ? parseInt(storedId, 10) : null;

  const { control, handleSubmit, register, setValue } = useForm({
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

  const { fields, append, remove } = useFieldArray({ 
    control, 
    name: "serviceAreas" 
  });

  const onSubmit = async (data) => {
    // Validate phone number
    if (data.tel.length !== 10) {
      setMessage("เบอร์โทรศัพท์ต้องมี 10 หลักเท่านั้น");
      return;
    }

    // Filter out any empty service areas
    const validServiceAreas = data.serviceAreas.filter(area => area.value);
    
    if (validServiceAreas.length === 0) {
      setMessage("กรุณาเลือกเขตที่ต้องการให้บริการอย่างน้อย 1 เขต");
      return;
    }
    
    // Store the data in ref for later use
    formData.current = {
      id: data.id,
      password: data.password,
      tel: data.tel,
      address: data.address,
      serviceAreas: validServiceAreas
    };
    
    // Show the confirmation popover
    setShowConfirmPopover(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setMessage("");
    setIsSuccess(false);
    setDebugInfo(null);
    
    if (!formData.current) return;
    
    // Create FormData
    const formData2 = new FormData();
    formData2.append('id', formData.current.id);
    formData2.append('password', formData.current.password);
    formData2.append('tel', formData.current.tel);
    formData2.append('address', formData.current.address);

    // Add each service area as a separate 'zone' entry
    formData.current.serviceAreas.forEach(area => {
      formData2.append('zone', area.value);
    });

    try {      
      const response = await fetch("/api/dog-walker/set-zone", {
        method: "POST",
        body: formData2,
      });
    
      // For debugging, get the response text first
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      
      // Try to parse the response text as JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        setDebugInfo({
          error: "Failed to parse JSON response",
          rawResponse: responseText.substring(0, 500)
        });
        throw new Error("Invalid JSON response from server");
      }
          
      if (!response.ok) {
        setMessage(result.message || "เกิดข้อผิดพลาด โปรดลองอีกครั้ง");
        console.error("Error:", result);
        
        // Show failure popover
        setResultStatus('failure');
        setShowConfirmPopover(false);
        setShowResultPopover(true);
      } else {
        setIsSuccess(true);
        setMessage("บันทึกข้อมูลสำเร็จ");
        console.log("Success:", result);
        
        // Show success popover
        setResultStatus('success');
        setShowConfirmPopover(false);
        setShowResultPopover(true);
      }
    } catch (error) {
      setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์: " + error.message);
      console.error("API Error:", error.message);
      
      // Show failure popover
      setResultStatus('failure');
      setShowConfirmPopover(false);
      setShowResultPopover(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle closing the result popover
  const handleResultPopoverClose = () => {
    setShowResultPopover(false);
    
    // If result was successful, redirect to workpage
    if (resultStatus === 'success') {
      router.push("/dog-walker/workpage");
    }
  };
  
  // Handle cancel button in confirmation popover
  const handleCancel = () => {
    setShowConfirmPopover(false);
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
                <div key={field.id} className="flex mb-2 items-center gap-2">
                  <div className="flex-grow">
                    <Select
                      onValueChange={(value) => setValue(`serviceAreas.${index}.value`, value)}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="rounded-md bg-[#C6C6C6] text-black">
                        <SelectValue placeholder="เลือกเขต" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.map((zone) => (
                          <SelectItem key={zone} value={zone}>
                            {zone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Only show remove button if there's more than one field */}
                  {fields.length > 1 && (
                    <Button 
                      type="button" 
                      variant="destructive" 
                      className="h-8 w-8 p-0" 
                      onClick={() => remove(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}

              {/* Button to Add More Service Areas */}
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => append({ value: "" })}
                className="mt-2"
              >
                + เพิ่มเขต
              </Button>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <Button type="submit" variant="default">
                ยืนยัน
              </Button>
              <Button type="button" variant="destructive">ยกเลิก</Button>
            </div>

            {/* Display API Response Messages */}
            {message && (
              <p className={`text-center mt-4 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Popover */}
      {showConfirmPopover && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-lg">
            <h3 className="text-lg font-bold mb-2">ยืนยันการอัพเดตข้อมูล</h3>
            <p className="mb-4">ท่านจะไม่สามารถกลับมาแก้ไขข้อมูลได้อีก</p>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={handleConfirm} 
                type="submit" variant="default" disabled={loading}
              >
                {loading ? "กำลังบันทึก..." : "ยืนยัน"}
              </Button>
              <Button 
                onClick={handleCancel} 
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
              >
                ยกเลิก
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Result Popover - Success or Failure */}
      {showResultPopover && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-lg">
            {resultStatus === 'success' ? (
              <>
                <h3 className="text-lg font-bold mb-2">การดำเนินการเสร็จสิ้น</h3>
                <p className="mb-4">บันทึกข้อมูลเข้าระบบเรียบร้อย</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-2">การดำเนินการไม่สำเร็จ</h3>
                <p className="mb-4">โปรดตรวจสอบข้อมูลของท่านอีกครั้ง</p>
              </>
            )}
            <div className="flex justify-center">
              <Button 
                onClick={handleResultPopoverClose} 
                type="button" 
                variant="default"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                ตกลง
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetZonePage;