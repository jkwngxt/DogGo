"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [name, setName] = useState(null);
    const [id, setId] = useState(null);

    useEffect(() => {
        // เปลี่ยนจาก sessionStorage เป็น localStorage
        const role = localStorage.getItem("userRole");
        if (role) {
            setUser(role);
        }
    }, []);

    const login = async (username, password) => {
        try {
            console.log("Attempting login with:", username);
            const response = await fetch("/api/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            console.log("Login response status:", response.status);
            console.log("Response headers:", [...response.headers.entries()]);

            // เช็คว่า response มี body หรือไม่
            const text = await response.text();
            console.log("Raw response:", text);

            // แปลง text เป็น JSON ถ้าเป็นไปได้
            let data;
            try {
                data = JSON.parse(text);
                console.log("Parsed data:", data);
            } catch (parseError) {
                console.error("Failed to parse response as JSON:", parseError);
                return { success: false, message: "Invalid server response format" };
            }

            if (!response.ok) {
                return { success: false, message: data.message || "Invalid username or password." };
            }

            // เก็บข้อมูลใน localStorage
            localStorage.setItem("userRole", data.user.role);
            setUser(data.user.role);

            localStorage.setItem("name", data.user.name);
            setName(data.user.name);

            localStorage.setItem("id", data.user.id);
            setId(data.user.id);

            // Dispatch events
            window.dispatchEvent(new Event('authStateChange'));
            window.dispatchEvent(new Event('storage'));

            // Redirect ตาม role
            switch (data.user.role) {
                case "dogWalker":
                    if (data.user.status === 0) {
                        router.push(`/dog-walker/setzone/:${data.user.id}`);
                    }
                    else {
                        router.push("/dog-walker/workpage");
                    }
                    break;
                case "admin":
                    router.push("/admin/walker-register");
                    break;
                case "customer":
                    router.push("/pet-owner/homepage");
                    break;
                default:
                    return { success: false, message: "Unknown role." };
            }

            return { success: true };
        } catch (err) {
            console.error("Login error:", err);
            return { success: false, message: "An error occurred. Please try again." };
        }
    };


    const logout = async () => {
        try {
            // เรียก API route สำหรับการ logout เพื่อลบ token cookie ที่ server
            const response = await fetch("/api/user/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            // ลบข้อมูลใน client-side storage
            // เปลี่ยนจาก sessionStorage เป็น localStorage
            localStorage.removeItem("userRole");
            localStorage.removeItem("name");
            localStorage.removeItem("id");
            setUser(null);
            setName(null);
            setId(null);

            // Dispatch events
            window.dispatchEvent(new Event('authStateChange'));
            window.dispatchEvent(new Event('storage'));

            // Redirect กลับไปยังหน้า login
            router.push("/login");

            return { success: true };
        } catch (error) {
            console.error("Logout error:", error);
            return { success: false, message: "Failed to logout" };
        }
    };

    return { user, login, logout, name, id };
};