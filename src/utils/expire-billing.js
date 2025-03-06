import { PrismaClient } from '@prisma/client';
import {ChangeWSStatusController} from "@/controllers/ChangeWSStatusController";

export async function updateExpiredWalkingServices() {
    try {
        const changeStatusCtrl = new ChangeWSStatusController()
        const prisma = new PrismaClient();

        // ค้นหา WalkingService ที่มีสถานะ 201 และมีการเชื่อมโยงกับ Billing ที่หมดอายุ

        const expiredServices = await prisma.$queryRaw`
            SELECT ws."ws_id"
            FROM "walking_service" ws
            JOIN "billing" b ON ws."ws_id" = b."ws_id"
            WHERE ws."ws_status" = 201
            AND b."ws_deadline" < NOW()
            AND b."b_status" = 100
        `;

        console.log(`Found ${expiredServices.length} expired walking services that need to be cancelled.`);

        // อัพเดทสถานะของแต่ละ WalkingService ที่หมดอายุเป็น 210 (ยกเลิก)
        if (changeStatusCtrl && expiredServices.length > 0) {
            for (const service of expiredServices) {
                // เรียกใช้ controller สำหรับเปลี่ยนสถานะ
                await changeStatusCtrl.changeWSStatusController( 210, service.ws_id,);
                console.log(`Updated walking service ID ${service.ws_id} to cancelled status (210).`);
            }
        } else if (expiredServices.length > 0) {
            console.warn('ChangeStatusController not provided, skipping status updates.');
        }

    } catch (error) {
        console.error('Error updating expired walking services:', error);
    }
}