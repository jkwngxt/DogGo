import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export class UserRegisterController {
    constructor(prismaClient = new PrismaClient()) {
        this.prisma = prismaClient;
    }

    async register(userData) {
        return this.prisma.$transaction(async (tx) => {
            try {
                // ตรวจสอบข้อมูลที่จำเป็น
                const requiredFields = ['username', 'password', 'email', 'name'];
                for (const field of requiredFields) {
                    if (!userData[field]) {
                        return {
                            success: false,
                            message: `Missing required field: ${field}`
                        };
                    }
                }

                // ตรวจสอบว่า username ซ้ำหรือไม่
                const existingUsername = await tx.user.findUnique({
                    where: { username: userData.username }
                });

                if (existingUsername) {
                    return {
                        success: false,
                        message: 'Username already exists'
                    };
                }

                // ตรวจสอบว่าอีเมลซ้ำหรือไม่
                const existingEmail = await tx.user.findUnique({
                    where: { email: userData.email }
                });

                if (existingEmail) {
                    return {
                        success: false,
                        message: 'Email already exists'
                    };
                }

                // เข้ารหัสรหัสผ่าน
                const hashedPassword = await bcrypt.hash(userData.password, 10);

                // สร้างผู้ใช้ใหม่พร้อมกับสุนัข (ถ้ามี)
                const newUser = await tx.user.create({
                    data: {
                        name: userData.name,
                        username: userData.username,
                        password: hashedPassword,
                        email: userData.email,
                        tel: userData.tel || null,
                        address: userData.address || null,
                        zone: userData.zone || null,
                        dogs: {
                            create: userData.dogs?.map(dog => ({
                                name: dog.name,
                                breed: dog.breed
                            })) || []
                        }
                    },
                    include: {
                        dogs: true // รวมข้อมูลสุนัขในการตอบกลับ
                    }
                });

                // ส่งคืนผลลัพธ์สำเร็จ
                return {
                    success: true,
                    message: 'User registered successfully',
                    userId: newUser.id
                };
            } catch (error) {
                console.error('Error registering user:', error);
                // ธุรกรรมจะถูกยกเลิกโดยอัตโนมัติเมื่อมีข้อผิดพลาด
                return {
                    success: false,
                    message: 'Internal server error'
                };
            }
        });
    }
}