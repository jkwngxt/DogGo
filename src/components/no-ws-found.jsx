import React from "react";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent } from "./ui/card";

export default function NoWSFound() {
    return (
        <div className="min-h-screen bg-yellow-100 p-6">
            <div className="max-w-3xl mx-auto mt-4">
            <Label className="text-3xl font-semibold">งานของฉัน</Label>
            {/* White frame with the message */}
            <Card className="mt-6 bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
            <CardContent className="p-6">
                <div className="flex justify-center items-center min-h-[120px]">
                <p className="text-lg text-gray-500 font-medium">ไม่พบรายการจองที่รอพิจารณา</p>
                </div>
            </CardContent>
            </Card>
            </div>
        </div>
    );
}