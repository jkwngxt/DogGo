import { PrismaClient } from "@prisma/client";

export class ReviewDWController {
    constructor(prismaInstance = new PrismaClient()) {
        this.prisma = prismaInstance;
    }

    async getReviewableWalkingService(userId) {
        try {
            if (!userId) {
                console.error("Error: userId is missing or authentication failed");
                return { success: false, message: "User authentication failed" };
            }

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

            const userWalkingServices = await this.prisma.walkingService.findMany({
                where: {
                    userId: userId,  
                    status: 204,  // completed 
                    review: { is: null }  // services that haven't been reviewed
                },
                select: { id: true }
            });
    
            // check if walkingServiceId belongs to userId
            const matchingService = userWalkingServices.find(service => service.id === walkingServiceId);

            if (!matchingService) {
                console.error(`Unauthorized Review: User (${userId}) try to review service (${walkingServiceId}), but allowed:`, userWalkingServices.map(s => s.id));
                return { 
                    success: false, 
                    message: "Unauthorized access or service not found",
                    details: {
                        requestedServiceId: walkingServiceId,
                        allowedServices: userWalkingServices.map(s => s.id)
                    }
                };
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