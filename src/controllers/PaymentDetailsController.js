import { PrismaClient } from '@prisma/client';

export class PaymentDetailsController {
    constructor(prismaClient = new PrismaClient()) {
        this.prisma = prismaClient;
    }

    async getPaymentDetails(userId, walkingServiceId) {
        try {
            if (!walkingServiceId) {
                return {
                    success: false,
                    message: 'ไม่พบข้อมูล Walking Service ID',
                    status: 400
                };
            }

            // ดึงข้อมูล Walking Service และ Billing ที่เกี่ยวข้อง
            const walkingService = await this.prisma.walkingService.findUnique({
                where: {
                    id: parseInt(walkingServiceId),
                },
                include: {
                    billing: true,
                    dogWalker: {
                        select: {
                            name: true,
                            pic: true,
                            tel: true,
                        },
                    },
                },
            });

            // ตรวจสอบว่ามีข้อมูลหรือไม่
            if (!walkingService) {
                return {
                    success: false,
                    message: 'ไม่พบข้อมูลการจอง',
                    status: 404
                };
            }

            // ตรวจสอบว่าผู้ใช้เป็นเจ้าของการจองหรือไม่
            if (walkingService.userId !== userId) {
                return {
                    success: false,
                    message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้',
                    status: 403
                };
            }

            // ตรวจสอบว่ามีข้อมูลการชำระเงินหรือไม่
            if (!walkingService.billing) {
                return {
                    success: false,
                    message: 'ไม่พบข้อมูลการชำระเงิน',
                    status: 404
                };
            }

            // ดึงข้อมูลสุนัขที่เกี่ยวข้อง
            const dogIds = walkingService.dogs;
            const dogs = await this.prisma.dog.findMany({
                where: {
                    id: {
                        in: dogIds,
                    },
                },
                select: {
                    id: true,
                    name: true,
                    breed: true,
                },
            });

            // สร้างเวลาหมดอายุการชำระเงิน (15 นาทีหลังจากสร้าง billing)
            const deadline = walkingService.billing.deadline;

            // สร้างข้อมูลการชำระเงิน
            return {
                success: true,
                data: {
                    walkingServiceId: walkingService.id,
                    billingId: walkingService.billing.id,
                    amount: walkingService.billing.total,
                    deadline: deadline,
                    status: walkingService.billing.status,
                    dogWalker: walkingService.dogWalker,
                    time: walkingService.time, // เวลาที่จอง (array ของชั่วโมง)
                    date: walkingService.date, // วันที่จอง
                    dogs: dogs, // ข้อมูลสุนัข
                }
            };
        } catch (error) {
            console.error('Error fetching payment details:', error);
            return {
                success: false,
                message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการชำระเงิน',
                status: 500
            };
        } finally {
            await this.prisma.$disconnect();
        }
    }
}