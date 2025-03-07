"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [name, setName] = useState(null);
    const [id, setId] = useState(null);

    useEffect(() => {
        const role = sessionStorage.getItem("userRole");
        if (role) {
            setUser(role);
        }
    }, []);

    const login = async (username, password) => {
        try {
            const response = await fetch("/api/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                return { success: false, message: data.message || "Invalid username or password." };
            }

            sessionStorage.setItem("userRole", data.user.role);
            setUser(data.user.role);

            localStorage.setItem("name",data.user.name);
            setName(data.user.name)

            localStorage.setItem("id",data.user.id);
            setId(data.user.id)

            // Dispatch a custom event for auth state change
            window.dispatchEvent(new Event('authStateChange'));
            window.dispatchEvent(new Event('storage'));

            // Redirect ตาม role
            switch (data.user.role) {
                case "dogWalker":
                    if (data.user.status===0) {
                        router.push(`/dog-walker/setzone/:${data.user.id}`);// edit to real setzone path
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
            sessionStorage.removeItem("userRole");
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
