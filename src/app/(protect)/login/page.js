"use client";

import React, { useState } from "react";
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

        if (!username.trim() || !password.trim()) {
            setErrorMessage("Username and password are required.");
            setIsLoading(false); // stop loading state
            return; // exit function
        }

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

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-[#FFF8D6]">
            {/* Login Card */}
            <div className="relative flex flex-col items-center p-10 bg-[#2668E3] rounded-2xl shadow-lg w-80 md:w-[400px]">
                {/* Logo */}
                <div className="absolute -top-28 ml-16 flex flex-col items-center">
                    <Image src={logoSVG} alt="Logo" width={280} height={280} />
                </div>
                
                <Label className="text-5xl font-bold text-white mb-9 mt-4">Login</Label>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-base font-medium w-full p-3 mt-5 border rounded-lg shadow-md shadow-[#0f4099] placeholder:text-black"
                    />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyPress} // press enter to login
                    className="text-base font-medium w-full p-3 mt-6 border rounded-lg shadow-md shadow-[#0f4099] placeholder:text-black"
                    />
                <button 
                    onClick={handleLogin}
                    disabled={isLoading}
                    className={`w-full p-3 mt-6 text-white bg-[#FFC74A] rounded-lg font-bold text-lg shadow-md shadow-[#0f4099] ${
                        isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-500"
                    }`}
                >
                    {isLoading ? "Logging in..." : "LOGIN"}
                </button>

                <div className="mt-8 text-base font-semibold text-black flex items-center">
                    <span>Don't have an account?</span>
                    <Link 
                    href="/register" 
                    className="font-bold text-white hover:text-[#FFC74A] ml-2 relative group"
                    >
                    Sign Up
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFC74A] group-hover:w-full transition-all duration-300"></span>
                    </Link>
                </div>
            </div>
            {/* Error Message - Placed Under the Card */}
            {errorMessage && (
                <p className="text-[#FF0000] text-lg font-semibold mt-5">{errorMessage}</p>
            )}
        </div>
    );
};

export default LoginPage;

