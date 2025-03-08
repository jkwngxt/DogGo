import { DogWalkerRegisterController } from '@/controllers/DogWalkerRegisterController.js';
import { NextResponse } from "next/server";
import { authenticateRequest } from "@/utils/jwt";

export async function POST(request) {
    try {
        // ตรวจสอบสิทธิ์ admin
        const { user, response } = await authenticateRequest(request, ["admin"]);
        if (response) return response;

        // แยก form data จาก request
        const formData = await request.formData();
        const name = formData.get('name');
        const imageFile = formData.get('pic');
        const email = formData.get('email');
        const username = formData.get('username');

        // ตรวจสอบข้อมูลที่จำเป็น
        if (!name || !email || !username) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // สร้าง object ข้อมูล dog walker
        const dogWalkerData = {
            name,
            username,
            email,
        };

        // เรียกใช้ controller
        const dogWalkerController = new DogWalkerRegisterController();
        const result = await dogWalkerController.register(dogWalkerData, imageFile);

        // ตรวจสอบผลลัพธ์และส่งกลับ response ที่เหมาะสม
        if (!result.success) {
            if (result.message.includes('already exists')) {
                return NextResponse.json(result, { status: 409 });
            }
            return NextResponse.json(result, { status: 500 });
        }

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error('Dog walker registration error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error'
            },
            { status: 500 }
        );
    }
}