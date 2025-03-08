import { NextResponse } from 'next/server';
import { SearchDWController } from "@/controllers/SearchDWController";
import { authenticateRequest } from '@/utils/jwt';
import { updateExpiredWalkingServices } from "@/utils/expire-billing";

export async function POST(request) {
    try {
        // ตรวจสอบการยืนยันตัวตนด้วย JWT (เฉพาะ customer เท่านั้น)
        const { user, response } = await authenticateRequest(request, ['customer']);
        if (response) return response;

        // รับข้อมูลจาก request body
        const body = await request.json();
        const { date, startTimeInt, endTimeInt } = body;

        // ตรวจสอบความถูกต้องของข้อมูล
        if (!date || !startTimeInt || !endTimeInt) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'ข้อมูลไม่ครบถ้วน กรุณาระบุวันที่และเวลาให้ครบถ้วน'
                },
                { status: 400 }
            );
        }

        // กำหนดค่าคงที่
        const START_TIME = 9; // 9:00 AM คือช่วงเวลาแรก

        // คำนวณดัชนีช่วงเวลา
        const start = startTimeInt - START_TIME + 1;
        const end = endTimeInt - START_TIME + 1;

        // สร้างอาร์เรย์ของช่วงเวลา
        const timeSlots = [];
        for (let i = start; i < end; i++) {
            timeSlots.push(i);
        }
        // ตัวอย่าง: เวลา 9.00-11.00 จะได้ช่วงเวลา [1, 2]

        // แปลงข้อมูลวันที่
        const dateTimeString = `${date} ${startTimeInt}:00:00`;
        const dateSearch = new Date(dateTimeString);

        // อัปเดตสถานะการจองที่หมดอายุ
        await updateExpiredWalkingServices();

        // เรียกใช้ controller
        const searchDWController = new SearchDWController();
        const result = await searchDWController.searchDogWalkers(dateSearch, timeSlots, user.userId);

        // ตรวจสอบความสำเร็จ
        if (!result.success) {
            return NextResponse.json(
                { success: false, message: result.message || result.msg },
                { status: 404 }
            );
        }

        // ส่งข้อมูลกลับ
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Search dog walkers error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}