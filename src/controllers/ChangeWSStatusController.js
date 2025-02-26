import { PrismaClient } from "@prisma/client";
import {EmailService} from "@/utils/email/emailService";

const prisma = new PrismaClient();
const emailService = new EmailService(); // สร้างอินสแตนซ์ของ EmailService

export class ChangeWSStatusController {
    /*
      Status codes:
      201 - awaiting payment
      202 - awaiting response
      203 - accepted
      204 - completed
      210 - cancelled
      220 - rejected
      230 - timeout
      240 - pending no service
      241 - no service
     */
    async changeWSStatusController(status, id) {
        try {
            // Validate the status code
            const validStatusCodes = [201, 202, 203, 204, 210, 220, 230, 240, 241];
            if (!validStatusCodes.includes(status)) {
                throw new Error(`Invalid status code: ${status}`);
            }

            // Validate the ID
            if (!id || isNaN(parseInt(id))) {
                throw new Error(`Invalid walking service ID: ${id}`);
            }

            const walkingService = await prisma.walkingService.findUnique({
                where: { id: parseInt(id) },
                include: {
                    user: true,
                    dogWalker: true,
                }
            });

            if (!walkingService) {
                throw new Error(`Walking service with ID ${id} not found`);
            }

            // Update the walking service record
            const updatedWalkingService = await prisma.walkingService.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    status: status
                }
            });

            // For certain status changes, additional actions may be needed
            switch (status) {
                case 203: // accepted
                    // Set accept timestamp to current time
                    await prisma.walkingService.update({
                        where: { id: parseInt(id) },
                        data: { accept: new Date() }
                    });

                    const dogs = await prisma.dog.findMany({
                        where: {
                            id: {
                                in: walkingService.dogs
                            }
                        }
                    });

                    // ส่งอีเมลแจ้งการยอมรับบริการ
                    const acceptanceDetails = {
                        userName: walkingService.user.name,
                        userTel: walkingService.user.tel,
                        userAddress: walkingService.user.address,
                        dogs: dogs,
                        serviceDate: walkingService.date.toISOString().split('T')[0],
                        startSlot: Math.min(...walkingService.time),
                        endSlot: Math.max(...walkingService.time),
                        totalPrice: walkingService.price.toString(),
                        dogWalkerName: walkingService.dogWalker.name,
                        dogWalkerTel: walkingService.dogWalker.tel || '-',
                        dogWalkerEmail: walkingService.dogWalker.email,
                        dogWalkerZone: walkingService.dogWalker.zone,
                        userZone: walkingService.user.zone
                    };

                    await emailService.sendAcceptanceNotification(
                        walkingService.id,
                        walkingService.user.email,
                        acceptanceDetails
                    );
                    break;

                case 220: // rejected
                    await prisma.billing.update({
                        where: {walkingServiceId: walkingService.id},
                        data: {
                            status: 120,
                        }
                    })

                    // ดึงข้อมูลสุนัขที่เกี่ยวข้อง
                    const dogsForRejection = await prisma.dog.findMany({
                        where: {
                            id: {
                                in: walkingService.dogs
                            }
                        }
                    });

                    // ส่งอีเมลแจ้งการปฏิเสธบริการ
                    const rejectionDetails = {
                        userName: walkingService.user.name,
                        userTel: walkingService.user.tel,
                        userAddress: walkingService.user.address,
                        dogs: dogsForRejection,
                        serviceDate: walkingService.date.toISOString().split('T')[0],
                        startSlot: Math.min(...walkingService.time),
                        endSlot: Math.max(...walkingService.time),
                        dogWalkerName: walkingService.dogWalker.name,
                        dogWalkerEmail: walkingService.dogWalker.email,
                        dogWalkerTel: walkingService.dogWalker.tel || '-',
                        totalPrice: walkingService.price.toString(),
                        dogWalkerZone: walkingService.dogWalker.zone,
                        userZone: walkingService.user.zone
                    };

                    await emailService.sendRejectionNotification(
                        walkingService.id,
                        walkingService.user.email,
                        rejectionDetails
                    );
                    break;

                case 204: // completed
                    // Logic for completed service
                    break;

                case 210: // cancelled
                    // Logic for cancelled service
                    break;
            }

            // Create a structured response object
            return {
                message: `Status updated successfully to ${status}`,
                walkingServiceId: updatedWalkingService.id,
                status: updatedWalkingService.status
            };
        } catch (error) {
            console.error("Error changing walking service status:", error);
            throw error;
        }
    }
}