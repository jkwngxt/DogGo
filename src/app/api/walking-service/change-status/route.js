import { ChangeWSStatusController } from "@/controllers/ChangeWSStatusController";
import { NextResponse } from "next/server";

const controller = new ChangeWSStatusController();

export async function PUT(request) {
    try {
        // รับข้อมูลจาก request body
        const body = await request.json();
        const { status, id } = body;

        console.log(status, id);

        // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วนหรือไม่
        if (status === undefined || id === undefined) {
            return NextResponse.json(
                { error: "Missing required fields: status and id" },
                { status: 400 }
            );
        }

        // เรียกใช้ controller เพื่ออัปเดตสถานะ
        const result = await controller.changeWSStatusController(status, id);

        // ส่งผลลัพธ์กลับไป
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("API Error:", error.message);

        // จัดการกับข้อผิดพลาดและส่งกลับ response ที่เหมาะสม
        if (error.message.includes("Invalid status code")) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        if (error.message.includes("Invalid walking service ID") ||
            error.message.includes("not found")) {
            return NextResponse.json(
                { error: error.message },
                { status: 404 }
            );
        }

        // ข้อผิดพลาดอื่นๆ
        return NextResponse.json(
            { error: "An error occurred while updating the walking service status" },
            { status: 500 }
        );
    }
}