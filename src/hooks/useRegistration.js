"use client";

import { useState } from 'react';

/**
 * Custom hook สำหรับจัดการข้อมูลการลงทะเบียน
 */
export const useRegistration = () => {
    // ข้อมูลผู้ใช้
    const [userData, setUserData] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
        tel: "",
        address: "",
        zone: "",
    });

    // ข้อมูลสุนัข
    const [dogData, setDogData] = useState([
        { id: 1, name: "", breed: "" }
    ]);

    // ข้อผิดพลาดและการตรวจสอบ
    const [errors, setErrors] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
        tel: "",
        address: "",
        zone: "",
    });

    // อัปเดตข้อมูลผู้ใช้
    const updateUserData = (field, value) => {
        // ล้าง error เมื่อมีการเปลี่ยนแปลงข้อมูล
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }

        setUserData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // ตรวจสอบความถูกต้องของข้อมูลผู้ใช้
    const validateUserData = () => {
        let isValid = true;
        const newErrors = { ...errors };

        // Username
        const usernameRegex = /^[a-z0-9-_.@]+$/; // อนุญาตภาษาอังกฤษพิมพ์เล็ก ตัวเลข และอักษรพิเศษบางตัว (-_.@)

        if (!userData.username) {
            newErrors.username = "กรุณากรอก Username";
            isValid = false;
        } else if (
            userData.username.startsWith('dw-') ||
            userData.username.startsWith('sp-')
        ) {
            newErrors.username = "Username ต้องไม่ขึ้นต้นด้วย dw- หรือ sp-";
            isValid = false;
        } else if (!usernameRegex.test(userData.username)) {
            newErrors.username = "Username ต้องเป็นภาษาอังกฤษพิมพ์เล็ก ตัวเลข และสัญลักษณ์ -_.@ เท่านั้น";
            isValid = false;
        } else {
            newErrors.username = "";
        }

        // Password
        if (!userData.password) {
            newErrors.password = "กรุณากรอก Password";
            isValid = false;
        } else if (userData.password.length < 8) {
            newErrors.password = "Password ต้องมีอย่างน้อย 8 ตัวอักษร";
            isValid = false;
        } else {
            newErrors.password = "";
        }

        // Name
        if (!userData.name) {
            newErrors.name = "กรุณากรอกชื่อ-สกุล";
            isValid = false;
        } else {
            newErrors.name = "";
        }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!userData.email) {
            newErrors.email = "กรุณากรอก Email";
            isValid = false;
        } else if (!emailRegex.test(userData.email)) {
            newErrors.email = "รูปแบบ Email ไม่ถูกต้อง";
            isValid = false;
        } else {
            newErrors.email = "";
        }

        // Phone
        const phoneRegex = /^0[0-9]{9}$/;
        if (!userData.tel) {
            newErrors.tel = "กรุณากรอกเบอร์โทรศัพท์";
            isValid = false;
        } else if (!phoneRegex.test(userData.tel)) {
            newErrors.tel = "เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0 และเป็นตัวเลข 10 หลัก";
            isValid = false;
        } else {
            newErrors.tel = "";
        }

        // Address
        if (!userData.address) {
            newErrors.address = "กรุณากรอกที่อยู่";
            isValid = false;
        } else {
            newErrors.address = "";
        }

        // Zone
        if (!userData.zone) {
            newErrors.zone = "กรุณาเลือกเขตที่อยู่";
            isValid = false;
        } else {
            newErrors.zone = "";
        }

        setErrors(newErrors);
        return isValid;
    };

    // ตรวจสอบความถูกต้องของข้อมูลสุนัข
    const validateDogData = () => {
        let isValid = true;

        // ตรวจสอบว่ามีข้อมูลสุนัขที่กรอกครบทุกตัวหรือไม่
        for (const dog of dogData) {
            if (!dog.name || !dog.breed) {
                isValid = false;

                // เลื่อนไปยังสุนัขตัวแรกที่ข้อมูลไม่ครบ
                const emptyDogElement = document.querySelector(`#dogname-${dog.id}`);
                if (emptyDogElement) {
                    emptyDogElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                break;
            }
        }

        return isValid;
    };

    // อัปเดตข้อมูลสุนัข
    const updateDogData = (id, field, value) => {
        setDogData(prev =>
            prev.map(dog => dog.id === id ? { ...dog, [field]: value } : dog)
        );
    };

    // เพิ่มข้อมูลสุนัข
    const addDog = () => {
        // ตรวจสอบว่าข้อมูลแถวล่าสุดกรอกครบหรือไม่ก่อนเพิ่มแถวใหม่
        const lastDog = dogData[dogData.length - 1];

        if (lastDog && lastDog.name && lastDog.breed) {
            setDogData(prev => [...prev, { id: Date.now(), name: "", breed: "" }]);
            return true;
        }

        return false;
    };

    // ลบข้อมูลสุนัข
    const removeDog = (id) => {
        if (dogData.length > 1) {
            setDogData(prev => prev.filter(dog => dog.id !== id));
        }
    };

    // ล้างข้อมูลทั้งหมด
    const clearAllData = () => {
        setUserData({
            username: "",
            password: "",
            name: "",
            email: "",
            tel: "",
            address: "",
            zone: "",
        });

        setDogData([{ id: 1, name: "", breed: "" }]);

        setErrors({
            username: "",
            password: "",
            name: "",
            email: "",
            tel: "",
            address: "",
            zone: "",
        });
    };

    return {
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
    };
};