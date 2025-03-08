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
                    },
                    orderBy: {
                        date: 'desc' // Initial sorting by date, will be overridden by custom sort
                    }
                });
            } else if (role.toLowerCase() === "customer") {
                walkingServices = await this.prisma.walkingService.findMany({
                    where: { userId: id },
                    include: {
                        dogWalker: true,
                        user: true,
                        review: true
                    },
                    orderBy: {
                        date: 'desc' // Initial sorting by date, will be overridden by custom sort
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
                    services: []
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
                    walkerTel: service.dogWalker.tel,
                    userName: service.user.name,
                    userTel: service.user.tel,
                    isReview: service.review !== null,
                };
            });

            // Custom sort function for status priority
            const getStatusPriority = (status) => {
                switch (status) {
                    case 201: return 1;
                    case 203: return 2;
                    case 204: return 3;
                    case 202: return 4;
                    case 220: return 5;
                    case 210: return 6;
                    default: return 7; // All other statuses
                }
            };

            // Sort by status priority first, then by date within each status group
            walkingServiceList.sort((a, b) => {
                const priorityA = getStatusPriority(a.status);
                const priorityB = getStatusPriority(b.status);

                if (priorityA !== priorityB) {
                    return priorityA - priorityB; // Sort by status priority
                }

                // If same status, sort by date (newest first)
                return new Date(b.serviceDate) - new Date(a.serviceDate);
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

    async getWSDetail(id, user) {
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

            // check if user can access or not
            let hasAccess = false;
            let currentUserRole = null;

            if (user.role === 'admin') {
                hasAccess = true;
                currentUserRole = 'admin';
            }
            // ถ้าเป็น customer ต้องตรวจสอบว่าเป็นเจ้าของ service (userId ตรงกับ user.id)
            else if (user.role === 'customer' && walkingService.userId === user.userId) {
                hasAccess = true;
                currentUserRole = 'customer';
            }
            // ถ้าเป็น dogWalker ต้องตรวจสอบว่าเป็นผู้รับผิดชอบ service (dogWalkerId ตรงกับ user.id)
            else if (user.role === 'dogWalker' && walkingService.dogWalkerId === user.userId) {
                hasAccess = true;
                currentUserRole = 'dogWalker';
            }

            if (!hasAccess) {
                return {
                    success: false,
                    message: 'You do not have permission to view this walking service'
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
                    })),
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
                },
                currentUserRole: currentUserRole
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to fetch walking service details'
            };
        }
    }
}