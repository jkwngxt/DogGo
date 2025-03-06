"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Label } from "@/components/ui/label";
import FogInputRow from "./fog-input-row";

const DogForm = ({
                     dogData,
                     showErrors,
                     onBack,
                     onInputChange,
                     onAddDog,
                     onDeleteDog,
                     onSubmit,
                     onCancel,
                     isLoading
                 }) => {
    // ตรวจสอบว่าข้อมูลแถวล่าสุดกรอกครบหรือไม่
    const isLastRowComplete = dogData.length > 0 &&
        (() => {
            const lastDog = dogData[dogData.length - 1];
            return lastDog.name && lastDog.name.trim() !== "" &&
                lastDog.breed && lastDog.breed.trim() !== "";
        })();

    // ฟังก์ชันเพิ่มสุนัข - เมื่อข้อมูลแถวล่าสุดครบถ้วน
    const handleAddDog = () => {
        if (isLastRowComplete) {
            onAddDog();
        }
    };

    // จัดการการเปลี่ยนแปลงข้อมูล
    const handleDogChange = (id, field, value) => {
        onInputChange(id, field, value);
    };

    return (
        <>
            <Label className="text-center text-3xl font-bold mb-5 mt-3">
                Sign Up - ข้อมูลสุนัข
            </Label>
            <Card className="w-9/12 h-auto bg-white p-6 shadow-lg">
                <div className="flex items-center mb-2">
                    <Button
                        variant="ghost"
                        className="p-2"
                        onClick={onBack}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 mr-2" />
                        กลับไปหน้าข้อมูลส่วนตัว
                    </Button>
                </div>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        {dogData.map((dog, index) => (
                            <FogInputRow
                                key={dog.id}
                                id={dog.id}
                                name={dog.name}
                                breed={dog.breed}
                                onChange={handleDogChange}
                                deleteRow={onDeleteDog}
                                showDelete={dogData.length > 1}
                                // แสดง error เฉพาะเมื่อ showErrors เป็น true (กดปุ่มสร้างบัญชี)
                                showErrors={showErrors}
                            />
                        ))}
                        <div>
                            <Button
                                variant="secondary"
                                className="ml-10"
                                onClick={handleAddDog}
                                // ปุ่มจะถูก disable เมื่อข้อมูลแถวล่าสุดไม่ครบถ้วน
                                disabled={!isLastRowComplete}
                            >
                                + เพิ่มสุนัข
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center items-end space-x-4">
                    <Button
                        variant="default"
                        onClick={onSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "กำลังสร้างบัญชี..." : "สร้างบัญชี"}
                    </Button>
                    <Button variant="destructive" onClick={onCancel}>ยกเลิก</Button>
                </CardFooter>
            </Card>
        </>
    );
};

export default DogForm;