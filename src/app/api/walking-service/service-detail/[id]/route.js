import { NextResponse } from 'next/server';
import { FetchWSController } from '@/controllers/FetchWSController';
import { authenticateRequest } from "@/utils/jwt";
import { updateExpiredWalkingServices } from "@/utils/expire-billing";

export async function GET(request, context) {
    try {
        // ตรวจสอบการยืนยันตัวตน
        const { user, response } = await authenticateRequest(request);
        if (response) return response;

        // อัปเดตสถานะการจองที่หมดอายุ
        await updateExpiredWalkingServices();

        // รับพารามิเตอร์จาก URL
        const params = context.params;
        const id = params.id;

        // ตรวจสอบว่ามี ID หรือไม่
        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Service ID is required' },
                { status: 400 }
            );
        }

        // แปลง ID เป็นตัวเลข
        const serviceId = parseInt(id);
        if (isNaN(serviceId)) {
            return NextResponse.json(
                { success: false, message: 'Invalid service ID, must be a number' },
                { status: 400 }
            );
        }

        // เรียกใช้ controller
        const wsController = new FetchWSController();
        const result = await wsController.getWSDetail(serviceId, user);

        // ตรวจสอบความสำเร็จ
        if (!result.success) {
            return NextResponse.json(
                { success: false, message: result.message },
                { status: result.message.includes('not found') ? 404 : 403 }
            );
        }

        // ส่งข้อมูลกลับ
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error in walking service detail route:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}