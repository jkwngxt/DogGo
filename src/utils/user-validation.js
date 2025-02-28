import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * ตรวจสอบว่าผู้ใช้ยังมีอยู่ในฐานข้อมูลหรือไม่
 * หมายเหตุ: ใช้เฉพาะใน API Routes เท่านั้น ไม่สามารถใช้ใน middleware ได้
 *
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
 * เวอร์ชันเต็มของ authenticateRequest สำหรับ API Routes ที่ตรวจสอบการมีอยู่ของผู้ใช้
 *
 * @param {object} user - ข้อมูลผู้ใช้ที่ถอดรหัสแล้วจาก jwt.js
 * @returns {Promise<boolean>} true ถ้าผู้ใช้มีอยู่จริง, false ถ้าไม่มี
 */
export const completeUserValidation = async (user) => {
    if (!user) return false;
    return await validateUserExists(user);
};