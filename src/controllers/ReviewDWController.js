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
                    review: { is: null }
                },
                include: {
                    dogWalker: true // fetch related dog walker details
                }
            });
            return { success: true, walkingServices };
        } catch (error) {
            console.error("Error fetching reviewable walking services:", error);
            return { success: false, message: "Failed to fetch walking service" };
        }
    }

    async createReview({ userId, walkingServiceId, rating, text }) {
        try {
            if (!rating || rating<1 || rating>5) {
                return { success: false, message: "Rating must be between 1 to 5"};
            }

            // check if the service exists & belongs to the user
            const walkingService = await this.prisma.walkingService.findUnique({
                where: { id: walkingServiceId },
                select: { userId: true, review: true }
            });

            if (!walkingService || walkingService.userId !== userId) {
                return { success: false, message: "Invalid service or unauthorized access" };
            }

            if (walkingService.review) {
                return { success: false, message: "This service has already been reviewed"};
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

            return { success: true, message: "Review submitted successfully", review: newReview };
        } catch (error) {
            console.error("Error submitting review:", error);
            return { success: false, message: "Failed to submit review" };
        }
    }
}