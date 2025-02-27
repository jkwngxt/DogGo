import { PrismaClient } from "@prisma/client";

export class PaymentController {
    constructor(prismaInstance = new PrismaClient()) {
        this.prisma = prismaInstance;
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

            // update billing status to paid
            await this.prisma.billing.update({
                where: { id: billingId },
                data: { status: 1 } // paid
            });

            // fetch walking service associated with the billing
            const billing = await this.prisma.billing.findUnique({
                where: { id: billingId },
                include: { walkingService: true }
            });

            if (!billing || !billing.walkingService) {
                throw new Error("WalkingService not found for this billing");
            }

            const walkingServiceId = billing.walkingService.id;

            // update walking service to awaiting response
            await this.prisma.walkingService.update({
                where: { id: walkingServiceId },
                data: { status: 1 }
            });

            // send email using api
            const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/emails/booking`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ walkingServiceId })
            });

            if (!emailResponse.ok) {
                throw new Error("Failed to send email notification")
            }

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