import { PrismaClient } from '@prisma/client';

export class SearchDWController {
    constructor(prismaClient = new PrismaClient()) {
        this.prisma = prismaClient;
    }

    async searchDogWalkers(date, timeSlots, userId) {
        try {
            // Find user to get their zone
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            });

            if (!user) {
                return {
                    success: false,
                    msg: 'No user found.'
                };
            }

            const userZone = user.zone;

            const availableDogWalkers = await this.queryAvailableDogWalkers(date, timeSlots, userZone);

            return {
                success: true,
                dogWalkers: availableDogWalkers
            };

        } catch (error) {
            console.error('Error searching dog walkers:', error);
            return {
                success: false,
                message: 'Failed to search dog walkers'
            };
        }
    }

    async queryAvailableDogWalkers(searchDate, timeSlots, userZone) {
        // แปลงให้เป็นวันที่เท่านั้น (YYYY-MM-DD)
        const dateOnly = searchDate.toISOString().split('T')[0];

        // First, find all dog walkers that match the initial criteria
        const allDogWalkers = await this.prisma.dogWalker.findMany({
            where: {
                status: 1,
                zone: {
                    has: userZone
                }
            },
            select: {
                id: true,
                name: true,
                pic: true,
                address: true,
                zone: true,
                services: {
                    where: {
                        date: {
                            gte: new Date(`${dateOnly}T00:00:00.000Z`),
                            lt: new Date(`${dateOnly}T23:59:59.999Z`)
                        },
                        time: {
                            hasSome: timeSlots
                        },
                        status: {
                            notIn: [210, 220, 230]
                        }
                    },
                    select: {
                        id: true
                    }
                }
            }
        });

        // Filter out dog walkers that have conflicting services
        const availableDogWalkers = allDogWalkers.filter(dw => dw.services.length === 0);

        // For each available dog walker, fetch their rating information
        const dogWalkersWithRatings = await Promise.all(
            availableDogWalkers.map(async dw => {
                // Get all services for this dog walker
                const services = await this.prisma.walkingService.findMany({
                    where: {
                        dogWalkerId: dw.id
                    },
                    select: {
                        id: true
                    }
                });

                const serviceIds = services.map(s => s.id);

                // Get reviews for these services
                const reviews = await this.prisma.review.findMany({
                    where: {
                        walkingServiceId: {
                            in: serviceIds.length > 0 ? serviceIds : [-1] // Avoid empty IN clause
                        }
                    },
                    select: {
                        rating: true
                    }
                });

                // Calculate mean rating
                const ratings = reviews.map(r => r.rating).filter(r => r !== null);
                const meanRating = ratings.length > 0
                    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
                    : 0;

                // Return dog walker with rating information
                return {
                    id: dw.id,
                    name: dw.name,
                    pic: dw.pic,
                    address: dw.address,
                    zone: dw.zone,
                    meanRating: parseFloat(meanRating.toFixed(2)),
                    ratingCount: ratings.length
                };
            })
        );

        // Sort by mean rating descending
        return dogWalkersWithRatings.sort((a, b) => b.meanRating - a.meanRating);
    }
}