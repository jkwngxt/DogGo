import { PrismaClient } from '@prisma/client';

export class UseCouponController {
    constructor(prismaClient = new PrismaClient()) {
        this.prisma = prismaClient;
    }

    async useCoupon(id, serviceProviderId) {
        try {
            // First, get the coupon to check if it exists and get its serviceId
            const coupon = await this.prisma.coupon.findUnique({
                where: { id },
                include: { service: true }
            });

            if (!coupon) {
                return {
                    success: false,
                    message: 'Coupon not found'
                };
            }

            // Check if the service belongs to the specified service provider
            if (coupon.service.providerId !== serviceProviderId) {
                return {
                    success: false,
                    message: 'This coupon cannot be used with this service provider'
                };
            }

            // Update the coupon status
            const updatedCoupon = await this.prisma.coupon.update({
                where: { id },
                data: { status: 302 }
            });

            return {
                success: true,
                data: updatedCoupon
            };
        } catch (error) {
            // Handle errors
            return {
                success: false,
                message: 'Error occurred while using coupon',
                error: error.message
            };
        }
    }
}