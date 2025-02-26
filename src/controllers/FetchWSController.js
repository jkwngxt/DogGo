import {PrismaClient} from "@prisma/client";

export class FetchWSController {
    constructor(prismaInstance = new PrismaClient()) {
        this.prisma = prismaInstance;
    }

    async getWSList(role, id) {
        try {
            let walkingServices;

            if (role.toLowerCase() === "dw") {
                walkingServices = await this.prisma.walkingService.findMany({
                    where: { dogWalkerId: id },
                    include: {
                        dogWalker: true,
                        user: true,
                        review: true
                    }
                });
            } else if (role.toLowerCase() === "user") {
                walkingServices = await this.prisma.walkingService.findMany({
                    where: { userId: id },
                    include: {
                        dogWalker: true,
                        user: true,
                        review: true
                    }
                });
            } else {
                return {
                    success: false,
                    message: 'Invalid role. Role must be "dw" or "user"'
                };
            }

            if (walkingServices.length === 0) {
                return {
                    success: true,
                    services: [] // เปลี่ยนจาก walkingServices เป็น services เพื่อให้สอดคล้องกับการ return ด้านล่าง
                };
            }

            // Calculate start and end times based on time slots
            const START_TIME = 9;

            const walkingServiceList = walkingServices.map((service) => {
                // Get the first and last elements from the time array
                let startHour = START_TIME + service.time[0] - 1;
                let endHour = START_TIME + service.time[service.time.length - 1];

                return {
                    serviceId: service.id,
                    serviceDate: service.date,
                    startHour: startHour,
                    endHour: endHour,
                    serviceStatus: service.status,
                    walkerName: service.dogWalker.name,
                    userName: service.user.name,
                    isReview: service.review !== null,
                };
            });

            return {
                success: true,
                services: walkingServiceList
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to fetch walking services'
            };
        }
    }

    async getWSDetail(id) {


    }
}