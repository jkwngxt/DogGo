import {PrismaClient} from '@prisma/client';

export class FetchReviewDWController {
    constructor(prismaClient = new PrismaClient()) {
        this.prisma = prismaClient;
    }

    async getReviewByDwId(userId, dwId) {
        try {
            const dogWalker = await this.getDogWalker(dwId);
            if (!dogWalker) {
                return {
                    success: false,
                    message: 'dog walker not found',
                };
            }

            const reviews = await this.getReviews(dwId);

            const dogs = await this.findDogByUserId(userId);

            const meanRating = reviews.length > 0
                ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                : 0;

            return {
                success: true,
                dogWalkers: {
                    id: dogWalker.id,
                    name: dogWalker.name,
                    pic: dogWalker.pic,
                    tel: dogWalker.tel,
                    zone: dogWalker.zone,
                    meanRating: parseFloat(meanRating.toFixed(2)),
                    ratingCount: reviews.length,
                    reviews: reviews.filter(r => r.text !== null).map(r => ({
                        user_id: r.userId,
                        username: r.user?.username || "",
                        text: r.text,
                        rating: r.rating,
                        time: r.time
                    }))
                },
                dogs: dogs
            };

        } catch (error) {
            console.error('Error fetching reviews:', error);
            return {
                success: false,
                message: 'Failed to fetch dog walker reviews'
            };
        }
    }

    // Get dog walker basic info
    async getDogWalker(dwId) {
        return this.prisma.dogWalker.findUnique({
            where: {
                id: dwId
            }
        });
    }

    async getReviews(dwId) {
        const walkingServices = await this.prisma.walkingService.findMany({
            where: {
                dogWalkerId: dwId
            },
            select: {
                id: true
            }
        });

        const serviceIds = walkingServices.map(service => service.id);

        if (serviceIds.length === 0) {
            return []; // No services, so no reviews
        }

        return this.prisma.review.findMany({
            where: {
                walkingServiceId: {
                    in: serviceIds
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });
    }

    // Get user's dogs
    async findDogByUserId(userId) {
        return this.prisma.dog.findMany({
            where: {
                ownerId: userId
            },
            select: {
                id: true,
                name: true
            }
        });
    }
}