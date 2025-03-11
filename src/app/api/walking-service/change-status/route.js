import { ChangeWSStatusController } from "@/controllers/ChangeWSStatusController";
import { NextResponse } from "next/server";
import { authenticateRequest } from "@/utils/jwt";

export async function PUT(request) {
    try {
        // ตรวจสอบ session
        const { user, response } = await authenticateRequest(request);
        if (response) return response;

        // รับข้อมูลจาก request body
        const body = await request.json();
        const { status, walkingServiceId } = body;

        // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วนหรือไม่
        if (status === undefined || walkingServiceId === undefined) {
            return NextResponse.json(
                { success: false, message: "Missing required fields: status and walking service id" },
                { status: 400 }
            );
        }

        // เรียกใช้ controller เพื่ออัปเดตสถานะ
        const controller = new ChangeWSStatusController();
        const result = await controller.changeWSStatusController(status, walkingServiceId);

        // ถ้ามีข้อผิดพลาด ส่งกลับ response ที่เหมาะสม
        if (!result.success) {
            return NextResponse.json(
                { success: false, message: result.message },
                { status: result.status || 500 }
            );
        }

        // ส่งผลลัพธ์กลับไป
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("API Error:", error.message);

        // กรณีที่เกิดข้อผิดพลาดที่ไม่ได้จัดการ
        return NextResponse.json(
            { success: false, message: "An error occurred while updating the walking service status" },
            { status: 500 }
        );
    }
}