import { NextResponse } from "next/server";
import { LoginController } from "@/controllers/LoginController";
import { cookies } from 'next/headers';

const loginController = new LoginController();

export async function POST(request) {
    try {
        const body = await request.json();
        console.log(body);
        const response = await loginController.login(body);

        // ถ้าเข้าสู่ระบบสำเร็จ เก็บ token ไว้ใน HTTP-only cookie
        if (response.status === 200 && response.body.token) {
            const cookieStore = await cookies();

            // ตั้งค่า cookie
            cookieStore.set('token', response.body.token, {
                httpOnly: true, // ป้องกัน JavaScript เข้าถึง
                secure: process.env.NODE_ENV === 'production', // ใช้ HTTPS ในโหมด production
                maxAge: 60 * 60 * 24, // หมดอายุใน 1 วัน (เป็นวินาที)
                path: '/', // ใช้ได้ทั้งเว็บไซต์
                sameSite: 'strict', // ป้องกัน CSRF
            });
        }

        return NextResponse.json(response.body, { status: response.status });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
}