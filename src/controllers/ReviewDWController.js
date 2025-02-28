import { PrismaClient } from "@prisma/client";

export class ReviewDWController {
    constructor(prismaInstance = new PrismaClient()) {
        this.prisma = prismaInstance;
    }

    async getReviewableWalkingService(userId) {
        try {
            const walkingServices = await this.prisma.walkingService.findMany({
                where: {
                    userId: userId,
                    status: 204, // completed
                    review: null
                },
                include: {
                    dogWalker: true // fetch related dog walker details
                }
            });
            return { status: "success", walkingServices };
        } catch (error) {
            console.error("Error fetching reviewable walking services:", error);
            return { status: "failed", message: "Failed to fetch walking service" };
        }
    }

    async createReview({ userId, walkingServiceId, rating, text }) {
        try {
            if (!rating || rating<1 || rating>5) {
                return { status: "failed", message: "Rating must be between 1 to 5"};
            }

            const walkingService = await this.prisma.walkingService.findUnique({
                where: { id: walkingServiceId },
                include: { review: true }
            });

            if (walkingService.review) {
                return { status: "failed", message: "This service has already been reviewed"};
            }

            // create new review
            const newReview = await this.prisma.review.create({
                data: {
                    userId,
                    walkingServiceId,
                    rating,
                    text,
                    time: new Date()
                }
            });

            return { status: "success", message: "Review submitted successfully", review: newReview };
        } catch (error) {
            console.error("Error submitting review:", error);
            return { status: "failed", message: "Failed to submit review" };
        }
    }
}