"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logoSVG from "/public/image/logo.svg"; 
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const LoginPage = () => {

    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // ฟังก์ชัน Login
    const handleLogin = async () => {
        setIsLoading(true);
        setErrorMessage(""); 
        try {
            const result = await login(username, password);
            if (!result.success) {
                setErrorMessage(result.message);
            }
        } catch (err) {
            setErrorMessage("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#FFF8D6]">
            <div className="relative flex flex-col items-center p-8 bg-[#2668E3] rounded-2xl shadow-lg w-80">
                {/* Logo */}
                <div className="absolute -top-24 ml-14 flex flex-col items-center">
                    <Image src={logoSVG} alt="Logo" width={250} height={250} />
                </div>
                
                <Label className="text-5xl font-semibold text-white mb-9 mt-4">Login</Label>
                {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 mt-4 border rounded-md shadow-md shadow-[#0f4099] placeholder:text-black"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mt-5 border rounded-md shadow-md shadow-[#0f4099] placeholder:text-black"
                />
                <button 
                    onClick={handleLogin}
                    disabled={isLoading}
                    className={`w-full p-2 mt-5 text-white bg-[#FFC74A] rounded-md font-semibold shadow-md shadow-[#0f4099] ${
                        isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-500"
                    }`}
                >
                    {isLoading ? "Logging in..." : "LOGIN"}
                </button>

                {/* Sign Up Link */}
                <p className="mt-6 mr-1 text-xs font-semibold text-black">
                    Don’t have an account? <Link href="/register" className="font-semibold text-white">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

