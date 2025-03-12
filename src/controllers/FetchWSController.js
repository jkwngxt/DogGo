import { PrismaClient } from "@prisma/client";

export class FetchWSController {
    constructor(prismaInstance = new PrismaClient()) {
        this.prisma = prismaInstance;
    }

    async getWSList(role, id) {
        try {
            let walkingServices;

            // ค้นหางานบริการตามบทบาทของผู้ใช้
            if (role.toLowerCase() === "dogwalker") {
                walkingServices = await this.prisma.walkingService.findMany({
                    where: { dogWalkerId: id },
                    include: {
                        dogWalker: true,
                        user: true,
                        review: true
                    },
                    orderBy: {
                        date: 'desc' // เรียงตามวันที่ล่าสุด (จะถูกแทนที่ด้วยการเรียงลำดับแบบกำหนดเอง)
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
                        date: 'desc' // เรียงตามวันที่ล่าสุด (จะถูกแทนที่ด้วยการเรียงลำดับแบบกำหนดเอง)
                    }
                });
            } else {
                return {
                    success: false,
                    message: 'Invalid role. Role must be "dogWalker" or "customer"'
                };
            }

            // ตรวจสอบว่ามีงานบริการหรือไม่
            if (walkingServices.length === 0) {
                return {
                    success: true,
                    services: []
                };
            }

            // คำนวณเวลาเริ่มต้นและสิ้นสุดตามช่วงเวลาที่กำหนด
            const START_TIME = 9; // เวลาเริ่มต้นคือ 9:00

            // แปลงข้อมูลงานบริการให้อยู่ในรูปแบบที่ต้องการ
            const walkingServiceList = walkingServices.map((service) => {
                // ดึงค่าแรกและค่าสุดท้ายจากอาร์เรย์เวลา
                const startHour = START_TIME + service.time[0] - 1;
                const endHour = START_TIME + service.time[service.time.length - 1];

                return {
                    serviceId: service.id,
                    serviceDate: service.date,
                    startHour: startHour,
                    endHour: endHour,
                    status: service.status,
                    walkerName: service.dogWalker.name,
                    walkerTel: service.dogWalker.tel,
                    walkerPic: service.dogWalker.pic, // เพิ่มรูปภาพของ dog walker
                    userName: service.user.name,
                    userTel: service.user.tel,
                    isReview: service.review !== null
                };
            });

            // ฟังก์ชั่นกำหนดลำดับความสำคัญของสถานะ
            const getStatusPriority = (status) => {
                switch (status) {
                    case 201: return 1; // รอการชำระเงิน
                    case 203: return 2; // ยอมรับแล้ว
                    case 204: return 3; // เสร็จสิ้น
                    case 202: return 4; // รอการตอบกลับ
                    case 220: return 5; // ปฏิเสธ
                    case 210: return 6; // ยกเลิก
                    default: return 7; // สถานะอื่นๆ
                }
            };

            // คำนวณความต่างของวันบริการกับวันปัจจุบัน
            const now = new Date();
            now.setHours(0, 0, 0, 0); // ตัดส่วนเวลาออกเพื่อเปรียบเทียบเฉพาะวันที่

            // เรียงลำดับตามความสำคัญของสถานะก่อน จากนั้นจึงเรียงตามวันที่ที่ใกล้วันปัจจุบันที่สุดในแต่ละกลุ่มสถานะ
            walkingServiceList.sort((a, b) => {
                const priorityA = getStatusPriority(a.status);
                const priorityB = getStatusPriority(b.status);

                // เรียงตามลำดับความสำคัญของสถานะ
                if (priorityA !== priorityB) {
                    return priorityA - priorityB;
                }

                // หากสถานะเดียวกัน เรียงตามวันที่ที่ใกล้ปัจจุบันที่สุด
                const dateA = new Date(a.serviceDate);
                const dateB = new Date(b.serviceDate);

                // คำนวณค่าสัมบูรณ์ของจำนวนวันต่างจากวันปัจจุบัน
                const diffA = Math.abs(dateA - now);
                const diffB = Math.abs(dateB - now);

                // เรียงจากวันที่ใกล้ปัจจุบันที่สุดไปยังวันที่ห่างออกไป
                return diffA - diffB;
            });

            return {
                success: true,
                services: walkingServiceList
            };
        } catch (error) {
            console.error("Error fetching walking services:", error);
            return {
                success: false,
                message: error.message || 'Failed to fetch walking services'
            };
        }
    }

    async getWSDetail(id, user) {
        try {
            // ค้นหางานบริการตาม ID
            const walkingService = await this.prisma.walkingService.findUnique({
                where: { id: parseInt(id) },
                include: {
                    dogWalker: true,
                    user: true,
                    review: true
                }
            });

            // ตรวจสอบว่ามีงานบริการหรือไม่
            if (!walkingService) {
                return {
                    success: false,
                    message: 'Walking service not found',
                    status: 404
                };
            }

            // ตรวจสอบสิทธิ์การเข้าถึง
            let hasAccess = false;
            let currentUserRole = null;

            // ตรวจสอบบทบาทและสิทธิ์
            if (user.role === 'admin') {
                // แอดมินสามารถเข้าถึงได้ทั้งหมด
                hasAccess = true;
                currentUserRole = 'admin';
            } else if (user.role === 'customer' && walkingService.userId === user.userId) {
                // ลูกค้าต้องเป็นเจ้าของงานบริการเท่านั้น
                hasAccess = true;
                currentUserRole = 'customer';
            } else if (user.role === 'dogWalker' && walkingService.dogWalkerId === user.userId) {
                // ผู้พาสุนัขเดินเล่นต้องเป็นผู้รับผิดชอบงานบริการเท่านั้น
                hasAccess = true;
                currentUserRole = 'dogWalker';
            }

            // หากไม่มีสิทธิ์เข้าถึง
            if (!hasAccess) {
                return {
                    success: false,
                    message: 'You do not have permission to view this walking service',
                    status: 403
                };
            }

            // ดึงข้อมูลสุนัขที่เกี่ยวข้อง
            const dogIds = walkingService.dogs;
            const dogs = await this.prisma.dog.findMany({
                where: {
                    id: {
                        in: dogIds
                    }
                }
            });

            // คำนวณเวลาเริ่มต้นและสิ้นสุด
            const START_TIME = 9; // เวลาเริ่มต้นคือ 9:00
            const startHour = START_TIME + walkingService.time[0] - 1;
            const endHour = START_TIME + walkingService.time[walkingService.time.length - 1];

            // จัดรูปแบบข้อมูลตามที่ต้องการ
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
                    pic: walkingService.dogWalker.pic // เพิ่มรูปภาพของ dog walker
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
            console.error("Error fetching walking service details:", error);
            return {
                success: false,
                message: error.message || 'Failed to fetch walking service details',
                status: 500
            };
        }
    }
}