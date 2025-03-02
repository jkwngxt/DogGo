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

            // Check availability using raw SQL query for better performance
            const availabilityResult = await prisma.$queryRaw`
                SELECT EXISTS (
                    SELECT 1
                    FROM walking_service ws
                    WHERE 
                        ws.dw_id = ${dogWalkerId}
                        AND ws.ws_date = ${bookingDate}::date
                        AND ws.ws_time && ${time}::smallint[]
                        AND ws.ws_status NOT IN (210, 220)
                ) AS has_conflict
            `;

            // If there's a conflict, return an error
            if (availabilityResult[0].has_conflict) {
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