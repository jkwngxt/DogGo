"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserForm from "@/components/register/user-form";
import DogForm from "@/components/register/dog-form";
import RegistrationDialogs from "@/components/register/registration-dialogs";
import { useRegistration } from "@/hooks/useRegistration";

const RegisterPage = () => {
    const router = useRouter();
    // State สำหรับการแสดงหน้า (user หรือ dog)
    const [currentStep, setCurrentStep] = useState("user");

    // สำหรับแสดงผลข้อผิดพลาดทั้งหมด
    const [showUserErrors, setShowUserErrors] = useState(false);
    const [showDogErrors, setShowDogErrors] = useState(false);

    // สำหรับควบคุมสถานะการส่งข้อมูล
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // ใช้ custom hook สำหรับการจัดการข้อมูลการลงทะเบียน
    const {
        userData,
        dogData,
        errors,
        updateUserData,
        updateDogData,
        validateUserData,
        validateDogData,
        addDog,
        removeDog,
        clearAllData,
        setErrors
    } = useRegistration();

    // ไปหน้าถัดไป (ข้อมูลสุนัข)
    const handleNext = () => {
        setShowUserErrors(true);
        if (validateUserData()) {
            setCurrentStep("dog");
            setShowUserErrors(false);
        } else {
            // Scroll to first error
            const firstErrorElement = document.querySelector('.error-message');
            if (firstErrorElement) {
                firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    // กลับไปหน้าข้อมูลผู้ใช้
    const handleBack = () => {
        setCurrentStep("user");
        setShowDogErrors(false);
    };

    // จัดการการเปลี่ยนแปลงข้อมูลผู้ใช้
    const handleInputChange = (field, value) => {
        updateUserData(field, value);
    };

    // จัดการการเปลี่ยนแปลงเขตที่อยู่
    const handleSelectChange = (value) => {
        updateUserData("zone", value);
    };

    // จัดการการเพิ่มสุนัข
    const handleAddDog = () => {
        addDog();
        // เมื่อเพิ่มสุนัขแล้ว ปิดการแสดง error
        setShowDogErrors(false);
    };

    // ส่งข้อมูลการลงทะเบียน
    const handleSubmit = async () => {
        setShowDogErrors(true);

        // ตรวจสอบข้อมูลสุนัข
        if (!validateDogData()) {
            return;
        }

        setIsLoading(true);

        try {
            // เตรียมข้อมูลสำหรับการลงทะเบียน
            const registrationData = {
                ...userData,
                dogs: dogData.map(dog => ({
                    name: dog.name,
                    breed: dog.breed
                }))
            };

            // เรียก API
            const response = await fetch('/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            });

            const result = await response.json();

            if (!response.ok) {
                // ตรวจสอบข้อผิดพลาดเฉพาะและอัปเดต field ที่เกี่ยวข้อง
                if (result.message?.includes('Username already exists')) {
                    setErrors(prev => ({
                        ...prev,
                        username: "Username นี้มีผู้ใช้งานแล้ว"
                    }));
                    setCurrentStep("user"); // กลับไปหน้าข้อมูลผู้ใช้
                    return;
                }

                if (result.message?.includes('Email already exists')) {
                    setErrors(prev => ({
                        ...prev,
                        email: "Email นี้มีผู้ใช้งานแล้ว"
                    }));
                    setCurrentStep("user"); // กลับไปหน้าข้อมูลผู้ใช้
                    return;
                }

                throw new Error(result.message || "Registration failed");
            }

            // แสดง success dialog และล้างข้อมูลฟอร์ม
            clearAllData();
            setShowDogErrors(false);
            setShowSuccessDialog(true);

        } catch (error) {
            // แสดง error dialog กรณีมี error ที่ไม่เกี่ยวกับการตรวจสอบข้อมูล
            setShowErrorDialog(true);
            setErrorMessage(error.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
        } finally {
            setIsLoading(false);
        }
    };

    // ยกเลิกการลงทะเบียน
    const handleCancel = () => {
        router.push("/");
    };

    // จัดการปิด success dialog
    const handleSuccessDialogClose = () => {
        setShowSuccessDialog(false);
        router.push("/login");
    };

    // จัดการปิด error dialog
    const handleErrorDialogClose = () => {
        setShowErrorDialog(false);
    };

    useEffect(() => {
        // ปิด success dialog และไปที่หน้า login หลังจาก 3 วินาที
        if (showSuccessDialog) {
            const timer = setTimeout(() => {
                setShowSuccessDialog(false);
                router.push("/login");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showSuccessDialog, router]);

    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-[#FFF8D6] py-8">
            {/* User Form */}
            {currentStep === "user" && (
                <UserForm
                    userData={userData}
                    errors={errors}
                    showErrors={showUserErrors}
                    onInputChange={handleInputChange}
                    onSelectChange={handleSelectChange}
                    onNext={handleNext}
                    onCancel={handleCancel}
                />
            )}

            {/* Dog Form */}
            {currentStep === "dog" && (
                <DogForm
                    dogData={dogData}
                    showErrors={showDogErrors}
                    onBack={handleBack}
                    onInputChange={updateDogData}
                    onAddDog={handleAddDog}
                    onDeleteDog={removeDog}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                />
            )}

            {/* Dialogs for Success and Error */}
            <RegistrationDialogs
                showSuccessDialog={showSuccessDialog}
                showErrorDialog={showErrorDialog}
                errorMessage={errorMessage}
                onSuccessClose={handleSuccessDialogClose}
                onErrorClose={handleErrorDialogClose}
            />
        </div>
    );
};

export default RegisterPage;