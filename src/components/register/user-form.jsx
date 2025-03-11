"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const zones = [
    "เขตคลองเตย", "เขตคลองสามวา", "เขตคลองสาน", "เขตคันนายาว", "เขตจตุจักร",
    "เขตจอมทอง", "เขตดอนเมือง", "เขตตลิ่งชัน", "เขตทวีวัฒนา", "เขตธนบุรี",
    "เขตบางกอกน้อย", "เขตบางกอกใหญ่", "เขตบางคอแหลม", "เขตบางซื่อ", "เขตบางนา",
    "เขตบางบอน", "เขตบางพลัด", "เขตบางขุนเทียน", "เขตบางเขน", "เขตบางแค",
    "เขตบางกะปิ", "เขตบางรัก", "เขตบึงกุ่ม", "เขตปทุมวัน", "เขตประเวศ", "เขตพระโขนง",
    "เขตภาษีเจริญ", "เขตมีนบุรี", "เขตยานนาวา", "เขตราษฎร์บูรณะ", "เขตลาดกระบัง",
    "เขตลาดพร้าว", "เขตวัฒนา", "เขตสายไหม", "เขตสะพานสูง", "เขตสาทร", "เขตสวนหลวง",
    "เขตหนองจอก", "เขตหนองแขม", "เขตหลักสี่", "เขตทุ่งครุ"
];

const UserForm = ({
                      userData,
                      errors,
                      showErrors,
                      onInputChange,
                      onSelectChange,
                      onNext,
                      onCancel
                  }) => {
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        onInputChange(id, value);
    };

    return (
        <>
            <Label className="text-center text-3xl font-bold mb-5 mt-3">
                Sign Up - ข้อมูลส่วนตัว
            </Label>
            <Card className="w-9/12 max-w-screen-md bg-white p-6 shadow-lg">
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="username"
                                className={`rounded-xl ${errors.username ? 'border-red-500' : ''}`}
                                value={userData.username}
                                onChange={handleInputChange}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1 error-message">{errors.username}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="password"
                                className={`rounded-xl ${errors.password ? 'border-red-500' : ''}`}
                                value={userData.password}
                                onChange={handleInputChange}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1 error-message">{errors.password}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="name">ชื่อ - สกุล</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="ชื่อ - สกุล"
                                className={`rounded-xl ${errors.name ? 'border-red-500' : ''}`}
                                value={userData.name}
                                onChange={handleInputChange}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1 error-message">{errors.name}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email"
                                className={`rounded-xl ${errors.email ? 'border-red-500' : ''}`}
                                value={userData.email}
                                onChange={handleInputChange}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1 error-message">{errors.email}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="tel">เบอร์โทรศัพท์</Label>
                            <Input
                                id="tel"
                                type="tel"
                                placeholder="เบอร์โทรศัพท์"
                                className={`rounded-xl ${errors.tel ? 'border-red-500' : ''}`}
                                value={userData.tel}
                                onChange={handleInputChange}
                            />
                            {errors.tel && (
                                <p className="text-red-500 text-sm mt-1 error-message">{errors.tel}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="address">ที่อยู่ปัจจุบัน</Label>
                            <Input
                                id="address"
                                type="text"
                                placeholder="ที่อยู่ปัจจุบัน"
                                className={`rounded-xl ${errors.address ? 'border-red-500' : ''}`}
                                value={userData.address}
                                onChange={handleInputChange}
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm mt-1 error-message">{errors.address}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="zone">เขตที่อยู่ปัจจุบัน</Label>
                            <Select onValueChange={onSelectChange} value={userData.zone}>
                                <SelectTrigger
                                    className={`flex h-9 w-full rounded-xl bg-[#C6C6C6] text-white placeholder:text-white ${errors.zone ? 'border-red-500' : ''}`}
                                >
                                    <SelectValue placeholder="เขตที่อยู่ปัจจุบัน" className="placeholder:text-white text-white" />
                                </SelectTrigger>
                                <SelectContent>
                                    {zones.map((zone) => (
                                      <SelectItem key={zone} value={zone}>
                                        {zone}
                                      </SelectItem>
                                    ))}
                              </SelectContent>
                            </Select>
                            {errors.zone && (
                                <p className="text-red-500 text-sm mt-1 error-message">{errors.zone}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center space-x-4">
                    <Button variant="default" onClick={onNext}>ถัดไป</Button>
                    <Button variant="destructive" onClick={onCancel}>ยกเลิก</Button>
                </CardFooter>
            </Card>
        </>
    );
};

export default UserForm;