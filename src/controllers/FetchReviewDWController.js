import { PrismaClient } from '@prisma/client';

export class FetchReviewDWController {
    constructor(prismaClient = new PrismaClient()) {
        this.prisma = prismaClient;
    }

    async getReviewByDwId(userId, dwId, startTimeInt, endTimeInt, date) {
        try {
            // Define constants
            const START_TIME = 9; // 9:00 AM is the first slot
            const END_TIME = 18;  // 6:00 PM is the last slot

            // Check time range validity
            let canBook = true;
            let timeSlots = [];

            // Validate time range (9-18)
            if (startTimeInt < START_TIME || startTimeInt > END_TIME ||
                endTimeInt < START_TIME || endTimeInt > END_TIME ||
                endTimeInt < startTimeInt
            ) {
                canBook = false;
            } else {
                // Calculate slot indices
                let start = startTimeInt - START_TIME + 1;
                let end = endTimeInt - START_TIME + 1;

                // Generate array of slots
                timeSlots = [];
                for (let i = start; i < end; i++) {
                    timeSlots.push(i);
                }
            }


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

            // Fetch user zone
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    zone: true
                }
            });

            // Fetch user's dogs
            const dogs = await this.prisma.dog.findMany({
                where: {
                    ownerId: userId
                },
                select: {
                    id: true,
                    name: true
                }
            });

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
            const ratingStats = {
                mean_rating: reviewsWithRating.length > 0
                    ? reviewsWithRating.reduce((sum, review) => sum + review.rating, 0) / reviewsWithRating.length
                    : 0,
                rating_count: reviewsWithRating.length
            };

            // Check availability
            let dbCanBook = canBook;
            let isBookedStatus = null;

            if (canBook) {
                // ใช้ startsWith เพื่อเปรียบเทียบเฉพาะวันที่ (YYYY-MM-DD)
                const dateOnly = date.toISOString().split('T')[0]; // เช่น "2025-03-03" จาก DateTime object

                const conflictingServices = await this.prisma.walkingService.findFirst({
                    where: {
                        dogWalkerId: dwId,
                        // เปรียบเทียบเฉพาะวันที่โดยใช้ startsWith
                        date: {
                            gte: new Date(`${dateOnly}T00:00:00.000Z`),
                            lt: new Date(`${dateOnly}T23:59:59.999Z`)
                        },
                        time: {
                            hasSome: timeSlots
                        },
                        status: {
                            notIn: [210, 220]
                        }
                    }
                });


                dbCanBook = !conflictingServices;

                if (!dbCanBook && conflictingServices.userId === userId) {
                    isBookedStatus = conflictingServices.status;
                }
            }

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
                canBook: dbCanBook,
                isBooked: isBookedStatus,
                dogWalkers: {
                    id: dogWalker.id,
                    name: dogWalker.name,
                    pic: dogWalker.pic,
                    tel: dogWalker.tel,
                    zone: dogWalker.zone,
                    meanRating: parseFloat(ratingStats.mean_rating.toFixed(2)),
                    ratingCount: ratingStats.rating_count,
                    reviews: formattedReviews
                },
                dogs: dogs || [],
                userZone: user ? user.zone : null
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