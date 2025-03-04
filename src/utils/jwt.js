import * as jose from 'jose';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const SECRET = new TextEncoder().encode(JWT_SECRET);

/**
 * ตรวจสอบและถอดรหัส JWT token จาก authorization header
 * @param {string} authHeader - Authorization header
 * @returns {Promise<object|null>} ข้อมูลผู้ใช้ที่ถอดรหัสแล้ว หรือ null ถ้าไม่ถูกต้อง
 */
export const verifyToken = async (authHeader) => {
    // ถ้าเป็น token โดยตรง (ใช้ใน middleware)
    if (authHeader && !authHeader.startsWith('Bearer ')) {
        try {
            const { payload } = await jose.jwtVerify(authHeader, SECRET);
            return payload;
        } catch (error) {
            console.error("Token verification failed:", error);
            return null;
        }
    }

    // ถ้าเป็น Authorization header (ใช้ใน API)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    try {
        const token = authHeader.split(' ')[1];
        const { payload } = await jose.jwtVerify(token, SECRET);
        return payload;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
};

/**
 * ตรวจสอบและถอดรหัส JWT token โดยตรง (สำหรับ middleware)
 * @param {string} token - Token string
 * @returns {Promise<object|null>} ข้อมูลผู้ใช้ที่ถอดรหัสแล้ว หรือ null ถ้าไม่ถูกต้อง
 */
export const verifyTokenDirect = async (token) => {
    if (!token) {
        return null;
    }

    try {
        const { payload } = await jose.jwtVerify(token, SECRET);
        return payload;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
};

/**
 * สร้าง JWT token
 * @param {object} payload - ข้อมูลที่จะเข้ารหัส
 * @returns {Promise<string>} JWT token
 */
export const signToken = async (payload) => {
    try {
        // กำหนดเวลาหมดอายุเป็น 1 วัน
        const jwt = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1 day')  // กำหนดค่าตายตัวแทนการใช้พารามิเตอร์
            .sign(SECRET);

        return jwt;
    } catch (error) {
        console.error("Token signing failed:", error);
        throw error;
    }
};

/**
 * Middleware สำหรับตรวจสอบการเข้าถึง API ของ Next.js
 * หมายเหตุ: ฟังก์ชันนี้ไม่สามารถใช้ PrismaClient ได้ ตรวจสอบเฉพาะ token เท่านั้น
 * @param {Request} request - Next.js request object
 * @param {Array<string>} allowedRoles - บทบาทที่อนุญาตให้เข้าถึง API นี้
 * @returns {Promise<{user: object, response: NextResponse|null}>} ข้อมูลผู้ใช้และ response ถ้ามีข้อผิดพลาด
 */
export const authenticateRequest = async (request, allowedRoles = []) => {
    // ตรวจสอบ token จาก Authorization header ก่อน
    const authHeader = request.headers.get('authorization');

    // ถ้ามี token ใน header ให้ตรวจสอบ
    let user = null;
    if (authHeader) {
        user = await verifyToken(authHeader);
    }

    // ถ้าไม่มี token ใน header หรือ token ไม่ถูกต้อง ให้ตรวจสอบจาก cookies
    if (!user) {
        const cookieStore = await cookies();
        const tokenFromCookie = cookieStore.get('token');

        if (tokenFromCookie) {
            user = await verifyTokenDirect(tokenFromCookie.value);
        }
    }

    // ถ้าไม่มี token ที่ถูกต้องทั้งใน header และ cookie
    if (!user) {
        return {
            user: null,
            response: NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            )
        };
    }

    console.log(user)

    // ตรวจสอบสิทธิ์
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return {
            user: null,
            response: NextResponse.json(
                { error: "Unauthorized. You don't have permission to access this resource" },
                { status: 403 }
            )
        };
    }

    return { user, response: null };
};