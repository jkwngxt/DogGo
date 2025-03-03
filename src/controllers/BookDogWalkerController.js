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

            // Convert date string to Date object
            const bookingDate = new Date(date);
            bookingDate.setHours(0, 0, 0, 0);

            // Check availability using Prisma query builder
            const conflictingService = await prisma.walkingService.findFirst({
                where: {
                    dogWalkerId: dogWalkerId,
                    date: bookingDate,
                    time: {
                        hasSome: time // Checks if any time slot conflicts
                    },
                    status: {
                        notIn: [210, 220] // Excluding certain status codes
                    }
                }
            });

            // If there's a conflict, return an error
            if (conflictingService) {
                return {
                    error: "Dog walker is already booked for the requested time slots.",
                    altFlow: true
                };
            }

            // If no conflict, proceed with booking
            const walkingService = await prisma.walkingService.create({
                data: {
                    userId,
                    dogWalkerId,
                    dogs: dogIds, // array
                    request: new Date(),
                    date: bookingDate,
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
                walkingServiceId: walkingService.id
            };

        } catch (error) {
            console.error("Prisma error", error);
            return { error: "Internal server error" };
        }
    }
}