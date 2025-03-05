import React from "react";
import Image from "next/image";

export default function Loading({ wantBg = true }) {
    return (
        <div
            className={`flex flex-col justify-center items-center min-h-screen p-4 ${
                wantBg ? "bg-gradient-to-b from-blue-50 to-white" : ""
            }`}>
            <div className="mb-6 animate-bounce">
                <Image src={"/image/logo.svg"} alt={"logo"} width={200} height={200} />
            </div>

            <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-blue-800 mb-2">กำลังโหลดข้อมูล</div>
                <div className="flex space-x-2 mt-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"
                         style={{animationDelay: "0s"}}></div>
                    <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"
                         style={{animationDelay: "0.2s"}}></div>
                    <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"
                         style={{animationDelay: "0.4s"}}></div>
                </div>
                <p className="text-blue-500 mt-4 text-center">กรุณารอสักครู่ เรากำลังเตรียมข้อมูลให้คุณ</p>
            </div>
        </div>
    )
}