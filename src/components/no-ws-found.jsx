import React from "react";
import Image from "next/image";

export default function NoWSFound({ wantBg = true }) {
    return (
        <div 
        className={`flex flex-col justify-center items-center min-h-screen p-4 transform -translate-y-10 ${
                wantBg ? "bg: #FFF8CC" : ""
            }`}>
                
            <div className="mb-6 ">
                <Image src={"/image/logo.svg"} alt={"logo"} width={200} height={200} />
            </div>

            <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-blue-800 mb-2">ไม่พบรายการการจองที่รอพิจารณา</div>
            </div>
        </div>
    )
}