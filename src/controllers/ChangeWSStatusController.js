import { PrismaClient } from "@prisma/client";
import { EmailService } from "@/utils/email/emailService";

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
    constructor(prismaClient = new PrismaClient(), emailService = new EmailService()) {
        this.prisma = prismaClient;
        this.emailService = emailService;
    }

    async changeWSStatusController(status, id) {
        try {
            // Validate the status code
            const validStatusCodes = [201, 202, 203, 204, 210, 220, 230, 240, 241];
            if (!validStatusCodes.includes(status)) {
                return {
                    success: false,
                    message: `Invalid status code: ${status}`,
                    status: 400
                };
            }

            // Validate the ID
            if (!id || isNaN(parseInt(id))) {
                return {
                    success: false,
                    message: `Invalid walking service ID: ${id}`,
                    status: 400
                };
            }

            const walkingService = await this.prisma.walkingService.findUnique({
                where: { id: parseInt(id) },
                include: {
                    user: true,
                    dogWalker: true,
                }
            });

            if (!walkingService) {
                return {
                    success: false,
                    message: `Walking service with ID ${id} not found`,
                    status: 404
                };
            }

            // Update the walking service record
            const updatedWalkingService = await this.prisma.walkingService.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    status: status
                }
            });

            // For certain status changes, additional actions may be needed
            let additionalInfo = {};

            switch (status) {
                case 203: // accepted
                    additionalInfo = await this.handleAcceptedStatus(walkingService);
                    break;
                case 220: // rejected
                    additionalInfo = await this.handleRejectedStatus(walkingService);
                    break;
                case 204: // completed
                    additionalInfo = await this.handleCompletedStatus(walkingService);
                    break;
                case 210: // cancelled
                    additionalInfo = await this.handleCancelledStatus(walkingService);
                    break;
            }

            // Create a structured response object
            return {
                success: true,
                message: `Status updated successfully to ${status}`,
                walkingServiceId: updatedWalkingService.id,
                status: updatedWalkingService.status,
                ...additionalInfo
            };
        } catch (error) {
            console.error("Error changing walking service status:", error);
            return {
                success: false,
                message: "Failed to update walking service status",
                status: 500
            };
        }
    }

    async handleAcceptedStatus(walkingService) {
        try {
            // Set accept timestamp to current time
            await this.prisma.walkingService.update({
                where: { id: walkingService.id },
                data: { accept: new Date() }
            });

            const dogs = await this.prisma.dog.findMany({
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

            await this.emailService.sendAcceptanceNotification(
                walkingService.id,
                walkingService.user.email,
                acceptanceDetails
            );

            return { emailSent: true };
        } catch (error) {
            console.error("Error handling accepted status:", error);
            return { emailSent: false };
        }
    }

    async handleRejectedStatus(walkingService) {
        try {
            await this.prisma.billing.update({
                where: { walkingServiceId: walkingService.id },
                data: {
                    status: 120, //pending refund
                }
            });

            // ดึงข้อมูลสุนัขที่เกี่ยวข้อง
            const dogsForRejection = await this.prisma.dog.findMany({
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

            await this.emailService.sendRejectionNotification(
                walkingService.id,
                walkingService.user.email,
                rejectionDetails
            );

            return { billingUpdated: true, emailSent: true };
        } catch (error) {
            console.error("Error handling rejected status:", error);
            return { billingUpdated: false, emailSent: false };
        }
    }

    async handleCompletedStatus(walkingService) {
        try {
            await this.prisma.billing.update({
                where: { walkingServiceId: walkingService.id },
                data: {
                    status: 102, //pending clearance
                }
            });

            // ดึงข้อมูลสุนัขที่เกี่ยวข้อง
            const dogsForCompletion = await this.prisma.dog.findMany({
                where: {
                    id: {
                        in: walkingService.dogs
                    }
                }
            });

            // ส่งอีเมลแจ้งการเสร็จสิ้นบริการและการชำระเงิน
            const completionDetails = {
                dogWalkerName: walkingService.dogWalker.name,
                dogWalkerEmail: walkingService.dogWalker.email,
                dogWalkerTel: walkingService.dogWalker.tel || '-',
                dogWalkerZone: walkingService.dogWalker.zone,
                userName: walkingService.user.name,
                userEmail: walkingService.user.email,
                userTel: walkingService.user.tel,
                userAddress: walkingService.user.address,
                userZone: walkingService.user.zone,
                dogs: dogsForCompletion,
                serviceDate: walkingService.date.toISOString().split('T')[0],
                startSlot: Math.min(...walkingService.time),
                endSlot: Math.max(...walkingService.time),
                totalPrice: walkingService.price.toString()
            };

            await this.emailService.sendCompletionNotification(
                walkingService.id,
                walkingService.dogWalker.email,
                completionDetails
            );

            return { billingUpdated: true, emailSent: true };
        } catch (error) {
            console.error("Error handling completed status:", error);
            return { billingUpdated: false, emailSent: false };
        }
    }

    async handleCancelledStatus(walkingService) {
        try {
            await this.prisma.billing.update({
                where: { walkingServiceId: walkingService.id },
                data: {
                    status: 210, //cancelled
                }
            });

            return { billingUpdated: true };
        } catch (error) {
            console.error("Error handling cancelled status:", error);
            return { billingUpdated: false };
        }
    }
}