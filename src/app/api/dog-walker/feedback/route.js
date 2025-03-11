import { NextResponse } from 'next/server';
import { FetchFeedbackDWController } from "@/controllers/FetchFeedbackDWController";
import { authenticateRequest } from "@/utils/jwt";

export async function GET(request) {
    try {
        // Authentication check
        const { user, response } = await authenticateRequest(request);
        if (response) return response;

        // ใช้ userId ของผู้ใช้ปัจจุบันเป็น dwId
        const dwId = user.userId;

        // เรียกใช้ controller
        const fetchFeedbackDW = new FetchFeedbackDWController();
        const result = await fetchFeedbackDW.getFeedbackByDwId(dwId);

        // ตรวจสอบผลลัพธ์
        if (!result.success) {
            if (result.message.includes('not found')) {
                return NextResponse.json(result, { status: 404 });
            }
            return NextResponse.json(result, { status: 500 });
        }

        // ส่งผลลัพธ์กลับไป
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Fetch feedback error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}