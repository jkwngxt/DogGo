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

            // create walking service
            const walkingService = await prisma.walkingService.create({
                data: {
                    userId,
                    dogWalkerId,
                    dogs: dogIds, // array
                    request: new Date(),
                    date: new Date(date), 
                    time, // time slots
                    price,
                    status: 0 // awaiting payment
                }
            });

            // create billing & connect walkingService
            const billing = await prisma.billing.create({
                data: {
                    userId,
                    status: 0, // awaiting payment
                    total: price,
                    walkingServiceId: walkingService.id 
                }
            });

            // ✅ Return success response
            return {
                message: "Booking successful",
                billingId: billing.id,
                walkingServiceId: walkingService.id
            };

        } catch (error) {
            console.error("⚠️ Prisma error:", error);
            return { error: "Internal Server Error." };
        }
    }
}