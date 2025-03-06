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
            <div className="relative flex flex-col items-center p-8 bg-[#2668E3] rounded-2xl shadow-lg w-80">
                {/* Logo */}
                <div className="absolute -top-24 ml-14 flex flex-col items-center">
                    <Image src={logoSVG} alt="Logo" width={250} height={250} />
                </div>
                
                <Label className="text-5xl font-bold text-white mb-9 mt-4">Login</Label>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-sm font-medium w-full p-2 mt-4 border rounded-md shadow-md shadow-[#0f4099] placeholder:text-black"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyPress} // press enter to login
                    className="text-sm font-medium w-full p-2 mt-5 border rounded-md shadow-md shadow-[#0f4099] placeholder:text-black"
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

                {/* Sign Up Link 
                <p className="mt-6 mr-1 text-sm font-semibold text-black">
                    Don’t have an account? <Link href="/register" className="font-semibold text-white">Sign Up</Link>
                </p> 
                {/* Sign Up Link with Improved Styling */}
                <div className="mt-8 text-sm font-semibold text-black flex items-center">
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
                <p className="text-[#FF0000] text-m mt-6">{errorMessage}</p>
            )}
        </div>
    );
};

export default LoginPage;

