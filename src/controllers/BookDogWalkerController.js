import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class BookDogWalkerController {
    async bookDogWalker(data) {
        try {
            const { userId, dogWalkerId, dogIds, date, time, price } = data;

            if (!userId || !dogWalkerId || !dogIds || dogIds.length === 0 || !date || !time || !price) {
                return { error: "Missing required fields." };
            }

            // create billing
            const billing = await prisma.billing.create({
                data: {
                    userId,
                    status: 0, // Awaiting
                    total: price
                }
            });

            // create walking service
            const walkingService = await prisma.walkingService.create({
                data: {
                    userId,
                    dogWalkerId,
                    dogs: dogIds, 
                    request: new Date(), 
                    date: new Date(date), 
                    time, 
                    price,
                    status: 0, // Awaiting payment
                    billing: { connect: { id: billing.id } }
                }
            });

            const mockQRCodeURL = `/qr-payment.png`; 

            return {
                message: "Dog Walker Booking successful.",
                billingId: billing.id,
                walkingServiceId: walkingService.id,
                paymentQRCode: mockQRCodeURL
            };

        } catch (error) {
            console.error("Internal server error.", error);
            return { error: "Internal server error." };
        }
    }
}