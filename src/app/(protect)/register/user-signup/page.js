import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import Link from "next/link";

const SignUpPage = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#FFF8D6]">
        <Label className="text-center text-3xl font-bold mb-2 mt-3">Sign Up - ข้อมูลส่วนตัว</Label>
        <Card className="w-9/12 max-w-screen-md bg-white p-6 shadow-lg">
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" placeholder="username" className="rounded-xl" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="password"className="rounded-xl" />
            </div>
            <div>
              <Label htmlFor="fullname">ชื่อ - สกุล</Label>
              <Input id="fullname" type="text" placeholder="ชื่อ - สกุล" className="rounded-xl" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email" className="rounded-xl" />
            </div>
            <div>
              <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
              <Input id="phone" type="tel" placeholder="เบอร์โทรศัพท์" className="rounded-xl" />
            </div>
            <div>
              <Label htmlFor="address">ที่อยู่ปัจจุบัน</Label>
              <Input id="address" type="text" placeholder="ที่อยู่ปัจจุบัน" className="rounded-xl" />
            </div>
            <div>
              <Label htmlFor="district">เขตที่อยู่ปัจจุบัน</Label>
              <Select>
                <SelectTrigger className="flex h-9 w-full rounded-xl bg-[#C6C6C6] text-white placeholder:text-white">
                <SelectValue placeholder="เขตที่อยู่ปัจจุบัน" className="placeholder:text-white text-white" />
                </SelectTrigger>
                <SelectContent>
                <SelectGroup>
                    <SelectLabel>เขตที่อยู่</SelectLabel>
                    <SelectItem value="เขตสายไหม">เขตสายไหม</SelectItem>
                    <SelectItem value="เขตจตุจักร">เขตจตุจักร</SelectItem>
                    <SelectItem value="เขตหลักสี่">เขตหลักสี่</SelectItem>
                    <SelectItem value="เขตดอนเมือง">เขตดอนเมือง</SelectItem>
                    <SelectItem value="เขตบางซื่อ">เขตบางซื่อ</SelectItem>
                    <SelectItem value="เขตลาดพร้าว">เขตลาดพร้าว</SelectItem>
                    <SelectItem value="เขตสะพานสูง">เขตสะพานสูง</SelectItem>
                    <SelectItem value="เขตบางเขน">เขตบางเขน</SelectItem>
                    <SelectItem value="เขตหนองจอก">เขตหนองจอก</SelectItem>
                    <SelectItem value="เขตบางกะปิ">เขตบางกะปิ</SelectItem>
                    <SelectItem value="เขตประเวศ">เขตประเวศ</SelectItem>
                    <SelectItem value="เขตลาดกระบัง">เขตลาดกระบัง</SelectItem>
                    <SelectItem value="เขตบึงกุ่ม">เขตบึงกุ่ม</SelectItem>
                    <SelectItem value="เขตคันนายาว">เขตคันนายาว</SelectItem>
                    <SelectItem value="เขตมีนบุรี">เขตมีนบุรี</SelectItem>
                    <SelectItem value="เขตคลองสามวา">เขตคลองสามวา</SelectItem>
                    <SelectItem value="เขตวัฒนา">เขตวัฒนา</SelectItem>
                    <SelectItem value="เขตสวนหลวง">เขตสวนหลวง</SelectItem>
                    <SelectItem value="เขตพระโขนง">เขตพระโขนง</SelectItem>
                    <SelectItem value="เขตสาทร">เขตสาทร</SelectItem>
                    <SelectItem value="เขตคลองเตย">เขตคลองเตย</SelectItem>
                    <SelectItem value="เขตบางคอแหลม">เขตบางคอแหลม</SelectItem>
                    <SelectItem value="เขตปทุมวัน">เขตปทุมวัน</SelectItem>
                    <SelectItem value="เขนบางรัก">เขนบางรัก</SelectItem>
                    <SelectItem value="เขตยานนาวา">เขตยานนาวา</SelectItem>
                    <SelectItem value="เขตบางนา">เขตบางนา</SelectItem>
                    <SelectItem value="เขตบางพลัด">เขตบางพลัด</SelectItem>
                    <SelectItem value="เขตบางกอกน้อย">เขตบางกอกน้อย</SelectItem>
                    <SelectItem value="เขตบางกอกใหญ่">เขตบางกอกใหญ่</SelectItem>
                    <SelectItem value="เขตตลิ่งชัน">เขตตลิ่งชัน</SelectItem>
                    <SelectItem value="เขตทวีวัฒนา">เขตทวีวัฒนา</SelectItem>
                    <SelectItem value="เขตจอมทอง">เขตจอมทอง</SelectItem>
                    <SelectItem value="เขตธนบุรี">เขตธนบุรี</SelectItem>
                    <SelectItem value="เขตคลองสาน">เขตคลองสาน</SelectItem>
                    <SelectItem value="เขตบางขุนเทียน">เขตบางขุนเทียน</SelectItem>
                    <SelectItem value="เขตบางแค">เขตบางแค</SelectItem>
                    <SelectItem value="เขตหนองแขม">เขตหนองแขม</SelectItem>
                    <SelectItem value="เขตภาษีเจริญ">เขตภาษีเจริญ</SelectItem>
                    <SelectItem value="เขตบางบอน">เขตบางบอน</SelectItem>
                    <SelectItem value="เขตทุ่งครุ">เขตทุ่งครุ</SelectItem>
                    <SelectItem value="เขตราษฏร์บูรณะ">เขตราษฏร์บูรณะ</SelectItem>
                </SelectGroup>
                </SelectContent>
            </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Link href="/"></Link>
          <Button variant="default">ถัดไป</Button>
          <Button variant="destructive">ยกเลิก</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;
