import { PrismaClient } from '@prisma/client';

export class SearchDWController {
    constructor(prismaClient = new PrismaClient()) {
        this.prisma = prismaClient;
    }

    async searchDogWalkers(date, timeSlots, userId) {
        try {
            // ค้นหาข้อมูลผู้ใช้เพื่อดึงพื้นที่
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            });

            // ตรวจสอบว่ามีผู้ใช้หรือไม่
            if (!user) {
                return {
                    success: false,
                    message: 'No user found.',
                    status: 404
                };
            }

            const userZone = user.zone;

            // ค้นหาผู้พาสุนัขเดินเล่นที่ว่าง
            const availableDogWalkers = await this.queryAvailableDogWalkers(date, timeSlots, userZone);

            return {
                success: true,
                dogWalkers: availableDogWalkers
            };
        } catch (error) {
            console.error('Error searching dog walkers:', error);
            return {
                success: false,
                message: 'Failed to search dog walkers',
                status: 500
            };
        }
    }

    /**
     * ค้นหาผู้พาสุนัขเดินเล่นที่ว่างในฐานข้อมูล
     * @param {Date} searchDate - วันที่ต้องการค้นหา
     * @param {Array<number>} timeSlots - ช่วงเวลาที่ต้องการค้นหา
     * @param {string} userZone - พื้นที่ของผู้ใช้
     * @returns {Promise<Array<object>>} - รายการผู้พาสุนัขเดินเล่นที่ว่าง
     */
    async queryAvailableDogWalkers(searchDate, timeSlots, userZone) {
        try {
            // แปลงให้เป็นวันที่เท่านั้น (YYYY-MM-DD)
            const dateOnly = searchDate.toISOString().split('T')[0];

            // ค้นหาผู้พาสุนัขเดินเล่นทั้งหมดที่ตรงตามเงื่อนไขเบื้องต้น
            const allDogWalkers = await this.prisma.dogWalker.findMany({
                where: {
                    status: 1,
                    zone: {
                        has: userZone
                    }
                },
                select: {
                    id: true,
                    name: true,
                    pic: true,
                    address: true,
                    zone: true,
                    tel: true,
                    services: {
                        where: {
                            date: {
                                gte: new Date(`${dateOnly}T00:00:00.000Z`),
                                lt: new Date(`${dateOnly}T23:59:59.999Z`)
                            },
                            time: {
                                hasSome: timeSlots
                            },
                            status: {
                                notIn: [210, 220, 230] // ไม่รวมสถานะยกเลิก, ปฏิเสธ, หมดเวลา
                            }
                        },
                        select: {
                            id: true
                        }
                    }
                }
            });

            // กรองผู้พาสุนัขเดินเล่นที่ไม่มีบริการที่ซ้ำซ้อน
            const availableDogWalkers = allDogWalkers.filter(dw => dw.services.length === 0);

            // สำหรับผู้พาสุนัขเดินเล่นที่ว่าง ดึงข้อมูลคะแนน
            const dogWalkersWithRatings = await Promise.all(
                availableDogWalkers.map(async dw => {
                    // ดึงบริการทั้งหมดของผู้พาสุนัขเดินเล่นนี้
                    const services = await this.prisma.walkingService.findMany({
                        where: {
                            dogWalkerId: dw.id
                        },
                        select: {
                            id: true
                        }
                    });

                    const serviceIds = services.map(s => s.id);

                    // ดึงรีวิวสำหรับบริการเหล่านี้
                    const reviews = await this.prisma.review.findMany({
                        where: {
                            walkingServiceId: {
                                in: serviceIds.length > 0 ? serviceIds : [-1] // หลีกเลี่ยง empty IN clause
                            }
                        },
                        select: {
                            rating: true
                        }
                    });

                    // คำนวณคะแนนเฉลี่ย
                    const ratings = reviews.map(r => r.rating).filter(r => r !== null);
                    const meanRating = ratings.length > 0
                        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
                        : 0;

                    // ส่งคืนข้อมูลผู้พาสุนัขเดินเล่นพร้อมคะแนน
                    return {
                        id: dw.id,
                        name: dw.name,
                        pic: dw.pic,
                        address: dw.address,
                        zone: dw.zone,
                        tel: dw.tel,
                        meanRating: parseFloat(meanRating.toFixed(2)),
                        ratingCount: ratings.length
                    };
                })
            );

            // เรียงลำดับตามคะแนนเฉลี่ยจากมากไปน้อย
            return dogWalkersWithRatings.sort((a, b) => b.meanRating - a.meanRating);
        } catch (error) {
            console.error('Error querying available dog walkers:', error);
            throw error;
        }
    }
}