import { NextResponse } from 'next/server';
import { FetchWSController } from "@/controllers/FetchWSController";
import { authenticateRequest } from "@/utils/jwt";
import { updateExpiredWalkingServices } from "@/utils/expire-billing";

export async function GET(request) {
    try {
        // ตรวจสอบการยืนยันตัวตน
        const { user, response } = await authenticateRequest(request);
        if (response) return response;

        // อัปเดตสถานะการจองที่หมดอายุ
        await updateExpiredWalkingServices();

        // ดึงข้อมูลผู้ใช้จาก token
        const role = user.role;
        const id = user.userId;

        // ตรวจสอบข้อมูลที่จำเป็น
        if (!role || !id) {
            return NextResponse.json(
                { success: false, message: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // เรียกใช้ controller
        const fetchWSController = new FetchWSController();
        const result = await fetchWSController.getWSList(role, id);

        // ตรวจสอบความสำเร็จ
        if (!result.success) {
            return NextResponse.json(
                { success: false, message: result.message },
                { status: 404 }
            );
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Fetch walking services error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error'
            },
            { status: 500 }
        );
    }
}