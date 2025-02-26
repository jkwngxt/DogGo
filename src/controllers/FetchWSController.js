import {PrismaClient} from "@prisma/client";

export class FetchWSController {
    constructor(prismaInstance = new PrismaClient()) {
        this.prisma = prismaInstance;
    }

    async getWSList(role, id) {
        try {
            let walkingServices;

            if (role.toLowerCase() === "dogwalker") {
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
                    message: 'Invalid role. Role must be "dogWalker" or "user"'
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
                    status: service.status,
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
        try {
            const walkingService = await this.prisma.walkingService.findUnique({
                where: { id: parseInt(id) },
                include: {
                    dogWalker: true,
                    user: true,
                    review: true
                }
            });

            if (!walkingService) {
                return {
                    success: false,
                    message: 'Walking service not found'
                };
            }

            // Get dogs information based on ids stored in walking service
            const dogIds = walkingService.dogs;
            const dogs = await this.prisma.dog.findMany({
                where: {
                    id: {
                        in: dogIds
                    }
                }
            });

            // Calculate start and end times based on time slots
            const START_TIME = 9;
            const startHour = START_TIME + walkingService.time[0] - 1;
            const endHour = START_TIME + walkingService.time[walkingService.time.length - 1];

            // Format the response according to the image requirements
            return {
                success: true,
                service: {
                    date: walkingService.date,
                    startTime: startHour,
                    endHour: endHour,
                    status: walkingService.status,
                    id: walkingService.id,
                    dogs: dogs.map(dog => ({
                        name: dog.name,
                        breed: dog.breed
                    }))
                },
                dw: {
                    name: walkingService.dogWalker.name,
                    tel: walkingService.dogWalker.tel,
                },
                user: {
                    name: walkingService.user.name,
                    tel: walkingService.user.tel,
                    zone: walkingService.user.zone,
                    address: walkingService.user.address
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to fetch walking service details'
            };
        }
    }
}