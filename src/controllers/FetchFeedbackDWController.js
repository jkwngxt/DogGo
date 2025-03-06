import { PrismaClient } from '@prisma/client';

export class FetchFeedbackDWController {
    constructor(prismaClient = new PrismaClient()) {
        this.prisma = prismaClient;
    }

    async getFeedbackByDwId(dwId) {
        try {
            // Fetch dog walker data
            const dogWalker = await this.prisma.dogWalker.findUnique({
                where: {
                    id: dwId
                },
                select: {
                    id: true,
                    name: true,
                    pic: true,
                    tel: true,
                    zone: true
                }
            });

            if (!dogWalker) {
                return {
                    success: false,
                    message: 'dog walker not found',
                };
            }

            // Get relevant services for this dog walker
            const relevantServices = await this.prisma.walkingService.findMany({
                where: {
                    dogWalkerId: dwId
                },
                select: {
                    id: true
                }
            });

            const relevantServiceIds = relevantServices.map(service => service.id);

            // Get reviews for these services
            const reviews = await this.prisma.review.findMany({
                where: {
                    walkingServiceId: {
                        in: relevantServiceIds
                    }
                },
                select: {
                    id: true,
                    userId: true,
                    text: true,
                    rating: true,
                    time: true,
                    user: {
                        select: {
                            username: true
                        }
                    }
                }
            });

            // Calculate rating summary
            const reviewsWithRating = reviews.filter(review => review.rating !== null);

            // Count reviews for each rating value (1-5)
            const ratingCounts = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0
            };

            reviewsWithRating.forEach(review => {
                if (review.rating >= 1 && review.rating <= 5) {
                    ratingCounts[review.rating]++;
                }
            });

            const ratingStats = {
                mean_rating: reviewsWithRating.length > 0
                    ? reviewsWithRating.reduce((sum, review) => sum + review.rating, 0) / reviewsWithRating.length
                    : 0,
                rating_count: reviewsWithRating.length,
                rating_distribution: ratingCounts
            };

            // Format reviews and filter out null text reviews
            const formattedReviews = reviews
                .filter(r => r.text !== null)
                .map(r => ({
                    user_id: r.userId,
                    username: r.user?.username || "",
                    text: r.text,
                    rating: r.rating,
                    time: r.time
                }));

            return {
                success: true,
                dogWalkers: {
                    id: dogWalker.id,
                    name: dogWalker.name,
                    pic: dogWalker.pic,
                    tel: dogWalker.tel,
                    zone: dogWalker.zone,
                    meanRating: parseFloat(ratingStats.mean_rating.toFixed(2)),
                    ratingCount: ratingStats.rating_count,
                    ratingDistribution: ratingStats.rating_distribution,
                    reviews: formattedReviews
                },
            };

        } catch (error) {
            console.error('Error fetching reviews:', error);
            return {
                success: false,
                message: 'Failed to fetch dog walker reviews'
            };
        }
    }
}