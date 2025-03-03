"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const router = useRouter();

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

            // Redirect ตาม role
            switch (data.user.role) {
                case "dogWalker":
                    router.push("/dog-walker/homepage");
                    break;
                case "admin":
                    router.push("/admin/admin-dog-walker/sign-up");
                    break;
                case "customer":
                    router.push("/pet-owner/homepage");
                    break;
                case "serviceProvider":
                    router.push("/service-provider/homepage");
                    break;
                default:
                    return { success: false, message: "Unknown role." };
            }

            return { success: true };
        } catch (err) {
            return { success: false, message: "An error occurred. Please try again." };
        }
    };

    const logout = () => {
        sessionStorage.removeItem("userRole");
        setUser(null);
        router.push("/login");
    };

    return { user, login, logout };
};
