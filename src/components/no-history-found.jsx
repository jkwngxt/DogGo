import React from "react";
import { Card, CardContent } from "./ui/card";
import { Label } from "@/components/ui/label";

export default function NoHistoryFound({ wantBg = true }) {
    return (
        <div className="min-h-screen bg-yellow-100 p-6">
            <div className="max-w-3xl mx-auto mt-4">
            <Label className="text-3xl font-semibold">ประวัติการรับงาน</Label>
            {/* White frame with the message */}
            <Card className="mt-6 bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
            <CardContent className="p-6">
                <div className="flex justify-center items-center min-h-[120px]">
                <p className="text-lg text-gray-500 font-medium">ไม่พบประวัติการให้บริการ</p>
                </div>
            </CardContent>
            </Card>
            </div>
        </div>
    );
}