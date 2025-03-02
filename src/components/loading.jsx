import React from "react";

export default function Loading() {
    return (
        <div
            className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
            <div className="mb-6">
                <svg className="w-32 h-32 animate-bounce" viewBox="0 0 100 100" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M75,40 Q90,30 85,45 Q80,60 90,60 Q100,60 95,70 Q90,80 80,80 Q70,80 60,70 L55,80 Q50,90 45,80 L40,70 Q30,80 20,80 Q10,80 5,70 Q0,60 10,60 Q20,60 15,45 Q10,30 25,40 Q30,45 35,30 L40,15 Q45,5 50,15 L55,30 Q60,45 65,40 Q70,35 75,40 Z"
                        fill="#3b82f6"
                        stroke="#1e40af"
                        strokeWidth="2"/>
                    <circle cx="30" cy="40" r="3" fill="#1e3a8a"/>
                    <circle cx="70" cy="40" r="3" fill="#1e3a8a"/>
                    <path d="M40,55 Q50,65 60,55" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round"/>
                </svg>
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