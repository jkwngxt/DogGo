// utils/jwt.js
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

/**
 * ตรวจสอบและถอดรหัส JWT token จาก authorization header
 * @param {string} authHeader - Authorization header
 * @returns {object|null} ข้อมูลผู้ใช้ที่ถอดรหัสแล้ว หรือ null ถ้าไม่ถูกต้อง
 */
export const verifyToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
};

/**
 * ตรวจสอบว่าผู้ใช้ยังมีอยู่ในฐานข้อมูลหรือไม่
 * @param {object} decodedUser - ข้อมูลผู้ใช้ที่ถอดรหัส JWT แล้ว
 * @returns {Promise<boolean>} true ถ้าผู้ใช้มีอยู่จริง, false ถ้าไม่มี
 */
export const validateUserExists = async (decodedUser) => {
    if (!decodedUser) return false;

    try {
        let userExists = false;

        if (decodedUser.role === "dogWalker") {
            const user = await prisma.dogWalker.findUnique({
                where: { id: decodedUser.userId }
            });
            userExists = !!user;
        } else if (decodedUser.role === "serviceProvider") {
            const user = await prisma.serviceProvider.findUnique({
                where: { id: decodedUser.userId }
            });
            userExists = !!user;
        } else {
            const user = await prisma.user.findUnique({
                where: { id: decodedUser.userId }
            });
            userExists = !!user;
        }

        return userExists;
    } catch (error) {
        console.error("User validation error:", error);
        return false;
    }
};

/**
 * Middleware สำหรับตรวจสอบการเข้าถึง API ของ Next.js
 * @param {Request} request - Next.js request object
 * @param {Array<string>} allowedRoles - บทบาทที่อนุญาตให้เข้าถึง API นี้
 * @returns {Promise<{user: object, response: NextResponse|null}>} ข้อมูลผู้ใช้และ response ถ้ามีข้อผิดพลาด
 */
export const authenticateRequest = async (request, allowedRoles = []) => {
    const authHeader = request.headers.get('authorization');
    const user = verifyToken(authHeader);

    if (!user) {
        return {
            user: null,
            response: NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            )
        };
    }

    // ตรวจสอบว่าผู้ใช้ยังมีอยู่ในฐานข้อมูลหรือไม่
    const userExists = await validateUserExists(user);
    if (!userExists) {
        return {
            user: null,
            response: NextResponse.json(
                { error: "User account not found" },
                { status: 401 }
            )
        };
    }

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