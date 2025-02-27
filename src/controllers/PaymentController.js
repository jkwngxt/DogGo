import { PrismaClient } from "@prisma/client";
import { EmailService } from '@/utils/email/emailService';

export class PaymentController {
    constructor(prismaInstance = new PrismaClient(), emailServiceInstance = new EmailService()) {
        this.prisma = prismaInstance;
        this.emailService = emailServiceInstance;
    }

    async processPayment(paymentData) {
        try {
            const { userId, billingId, amount, confirmed } = paymentData;

            if (!confirmed) {
                return {
                    status: "pending",
                    qrImage: "qr-payment.png",
                    message: "Please confirm the payment"
                };
            }

            // fetch billing related with walking service
            const billing = await this.prisma.billing.findUnique({
                where: { id: billingId },
                include: { walkingService: { include: { dogWalker: true, user: true } } }
            });

            if (!billing || !billing.walkingService || !billing.walkingService.dogWalker) {
                return {
                    status: "failed",
                    message: "Billing or related walking service not found"
                };
            }

            const walkingService = billing.walkingService;
            const dogWalker = walkingService.dogWalker;
            const user = walkingService.user;

            // use transcation to ensure atomic updates (if one fails, all fail)
            await this.prisma.$transaction([
                this.prisma.billing.update({
                    where: { id: billingId },
                    data: { status: 101 } // paid
                }),
                this.prisma.walkingService.update({
                    where: { id: walkingService.id },
                    data: { status: 202 } // awaiting response
                })
            ])

             // ดึงข้อมูลสุนัข
            const dogs = await this.prisma.dog.findMany({
                where: {
                    id: { in: walkingService.dogs }
                }
            });

            // สร้าง time slots จาก array ของเวลา
            const startSlot = Math.min(...walkingService.time);
            const endSlot = Math.max(...walkingService.time);

            // prepare booking details for email
            const bookingDetails = {
                userName: user.name,
                userEmail: user.email,
                userTel: user.tel,
                userAddress: user.address,
                dogs: dogs,
                serviceDate: walkingService.date.toISOString().split('T')[0],
                startSlot,
                endSlot,
                totalPrice: walkingService.price.toString(),
                // เพิ่มข้อมูล dog walker
                dogWalkerName: dogWalker.name,
                dogWalkerEmail: dogWalker.email,
                dogWalkerTel: dogWalker.tel || '-',
                dogWalkerZone: dogWalker.zone,
                userZone: user.zone
            };

            const emailPath = await this.emailService.sendBookingNotification(
                walkingService.id,
                dogWalker.username,
                bookingDetails
            );

            return {
                status: "success",
                message: "Payment successful. Booking is awaiting confirmation"
            };
        } catch (error) {
            console.error("Payment controller error:", error);
            return {
                status: "failed",
                message: "Payment failed. Please try again"
            };
        }
    }
}