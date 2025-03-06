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
                                        <SelectItem value="เขตบางรัก">เขตบางรัก</SelectItem>
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