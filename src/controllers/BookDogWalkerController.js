import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class BookDogWalkerController {
    async bookDogWalker(data) {
        try {
            const { userId, dogWalkerId, dogIds, date, time, price } = data;

            if (!userId || !dogWalkerId || !dogIds || dogIds.length === 0 || !date || !time || !price) {
                return { error: "Missing required fields." };
            }

            if (!Array.isArray(dogIds)) {
                return { error: "dogIds must be an array." };
            }

            const dateOnly = date.toISOString().split('T')[0];

            // Check availability using Prisma query builder
            const conflictingService = await prisma.walkingService.findFirst({
                where: {
                    dogWalkerId: dogWalkerId,
                    date: {
                        gte: new Date(`${dateOnly}T00:00:00.000Z`),
                        lt: new Date(`${dateOnly}T23:59:59.999Z`)
                    },
                    time: {
                        hasSome: time // Checks if any time slot conflicts
                    },
                    status: {
                        notIn: [210, 220] // Excluding certain status codes
                    }
                },
                include: {
                    billing: true // Include the related billing
                }
            });

            // If there's a conflict
            if (conflictingService) {
                // If it's a different user, return error
                if (conflictingService.userId !== userId) {
                    return {
                        error: "Dog walker is already booked for the requested time slots.",
                        altFlow: true
                    };
                }

                // If it's the same user, return existing booking info
                if (conflictingService.billing) {
                    return {
                        message: "You have already booked this dog walker for these time slots.",
                        billingId: conflictingService.billing.id,
                        walkingServiceId: conflictingService.id,
                        amount: conflictingService.price.toString()
                    };
                } else {
                    // In case the conflicting service doesn't have a billing for some reason
                    const billing = await prisma.billing.findFirst({
                        where: {
                            walkingServiceId: conflictingService.id
                        }
                    });

                    if (billing) {
                        return {
                            message: "You have already booked this dog walker for these time slots.",
                            billingId: billing.id,
                            walkingServiceId: conflictingService.id,
                            amount: conflictingService.price.toString()
                        };
                    }
                }
            }

            // If no conflict, proceed with booking
            const walkingService = await prisma.walkingService.create({
                data: {
                    userId,
                    dogWalkerId,
                    dogs: dogIds, // array
                    request: new Date(),
                    date: date,
                    time, // time slots
                    price,
                    status: 201 // awaiting payment
                }
            });

            // create billing & connect walkingService
            const billing = await prisma.billing.create({
                data: {
                    userId,
                    status: 100, // awaiting payment
                    total: price,
                    walkingServiceId: walkingService.id
                }
            });

            return {
                message: "Booking successful",
                billingId: billing.id,
                walkingServiceId: walkingService.id,
                amount: price.toString()
            };

        } catch (error) {
            console.error("Prisma error", error);
            return { error: "Internal server error" };
        }
    }
}