import { NextResponse } from 'next/server';
import { UserRegisterController } from '@/controllers/UserRegisterController';

export async function POST(request) {
    try {
        // รับข้อมูลจาก request body
        const body = await request.json();

        // ตรวจสอบข้อมูลที่จำเป็น
        const requiredFields = ['username', 'password', 'email', 'name'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Missing required field: ${field}`
                    },
                    { status: 400 }
                );
            }
        }

        // เรียกใช้ controller
        const userController = new UserRegisterController();
        const result = await userController.register(body);

        // ตรวจสอบความสำเร็จและส่งข้อมูลกลับ
        if (!result.success) {
            if (result.message.includes('already exists')) {
                return NextResponse.json(result, { status: 409 });
            }
            return NextResponse.json(result, { status: 500 });
        }

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error('User registration error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error'
            },
            { status: 500 }
        );
    }
}