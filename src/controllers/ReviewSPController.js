import { PrismaClient } from "@prisma/client";

export class ReviewSPController {
    constructor(prismaInstance = new PrismaClient()) {
        this.prisma = prismaInstance;
    }

    async getRedeemableCoupons(userId) {
        try {
            const coupons = await this.prisma.coupon.findMany({
                where: {
                    userId: userId,
                    status: 302, // redeemed
                    review: { is: null } // no review yet
                },
                include: {
                    service: { include: { provider: true } } // include service provider details
                }
            });
            return { status: "success", coupons };
        } catch (error) {
            console.error("Error fetching redeemable coupons", error);
            return { status: "failed", message: "Failed to fetch redeemable coupons." };
        }
    }

    async createReview(reviewData) {
        try {
            const { userId, couponId, rating, text } = reviewData;

            const coupon = await this.prisma.coupon.findUnique({
                where: { id: couponId },
                include: { review: true }
            });

            if (!coupon) {
                return { status: "failed", message: "Invalid coupon id"};
            }

            if (coupon.review) {
                return { status: "failed", message: "This coupon has already been reviewed"};
            }

            if (!rating || rating<1 || rating>5) {
                return { status: "failed", message: "Rating must be between 1 and 5"};
            }

            const newReview = await this.prisma.review.create({
                data: {
                    userId,
                    couponId,
                    rating,
                    text: text || null,
                    time: new Date()
                }
            });

            return {
                status: "success",
                message: "Review submitted successfully",
                review: newReview
            };
        } catch (error) {
            console.error("Error creating review");
            return { status: "failed", message: "Failed to submit review"};
        }
    }
}
