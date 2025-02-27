"use client"; // Ensures it's a client component

import { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js navigation
import Image from "next/image";
import Link from "next/link";
import logoSVG from "/public/image/logo.svg"; 
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            // const response = await fetch("/api/login", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ username, password }),
            // });

            // const data = await response.json();
            

            // if (response.ok) {
            //     // Store role in sessionStorage //change dog walker in to userRole later
            //     sessionStorage.setItem("dog_walker", data.role);

            //     // Redirect based on role
            //     if (data.role === "dog_walker") {
            //         router.push("publicPage/dog-walker/dog-walker-home");
            //     } else if (data.role === "admin") {
            //         router.push("/admin-home");
            //     } else if (data.role === "pet_owner") {
            //         router.push("/pet-owner-home");
            //     } else if (data.role === "service_provider") {
            //         router.push("/service-provider-home");
            //     } else {
            //         router.push("/"); // Default homepage
            //     }
            // } else {
            //     setError("Invalid username or password");
            // }
            const data = 'dog_walker';
            sessionStorage.setItem("dog_walker", data);

                // Redirect based on role
                if (data === "dog_walker") {
                    router.push("dog-walker/dog-walker-home");
                } else if (data === "admin") {
                    router.push("/admin-home");
                } else if (data === "pet_owner") {
                    router.push("/pet-owner-home");
                } else if (data === "service_provider") {
                    router.push("/service-provider-home");
                } 
        } catch (err) {
            console.error("Login error:", err);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#FFF8D6]">
            <div className="relative flex flex-col items-center p-8 bg-[#2668E3] rounded-2xl shadow-lg w-80">
                {/* Logo */}
                <div className="absolute -top-24 ml-14 flex flex-col items-center">
                    <Image src={logoSVG} alt="Logo" width={250} height={250} />
                </div>
                
                {/* Login Form */}
                <Label className="text-5xl font-semibold text-white mb-9 mt-4">Login</Label>
                {error && <p className="text-red-500">{error}</p>}
                
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
                    className="w-full p-2 mt-5 text-white bg-[#FFC74A] rounded-md font-semibold hover:bg-yellow-500 shadow-md shadow-[#0f4099]"
                >
                    LOGIN
                </button>

                {/* Sign Up Link */}
                <p className="mt-6 mr-1 text-xs font-semibold text-black">
                    Don’t have an account? <Link href="/signup" className="font-semibold text-white">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
