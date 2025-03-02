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
            if (!userId) {
                console.error("Error: userId is missing!");
                return { success: false, message: "User authentication failed" };
            }

            if (!rating || rating<1 || rating>5) {
                return { success: false, message: "Rating must be between 1 to 5"};
            }

            // check if the service exists & belongs to the user
            const walkingService = await this.prisma.walkingService.findUnique({
                where: { id: walkingServiceId },
                select: { userId: true, review: true }
            });

            if (!walkingService) {
                console.error("Error: Invalid service ID!");
                return { success: false, message: "Invalid service ID" };
            }
    
            if (walkingService.userId !== userId) {
                console.error(`Service belongs to user ${walkingService.userId}, but request from ${userId}`);
                return { success: false, message: "Unauthorized access" };
            }

            if (walkingService.review) {
                console.error("Error: This service has already been reviewed!");
                return { success: false, message: "This service has already been reviewed" };
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