import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generatePassword } from '@/utils/passwordGenerator.js';
import { EmailService } from '@/utils/emailService.js';
import { FileUploadService } from "@/utils/fileUpload";

export class SearchDWController {
    constructor(prismaClient = new PrismaClient(), emailService = new EmailService(), fileUploadService = new FileUploadService()) {
        this.prisma = prismaClient;
    }

    async searchDogWalkers(date, timeSlots, userZone) {

        try {
            // Find available dog walkers who don't have services that conflict with the requested time
            const searchDate = new Date(date);
            searchDate.setHours(0, 0, 0, 0);
            const availableDogWalkers = await this.queryAvailableDogWalkers(searchDate, timeSlots, userZone);


            if (availableDogWalkers.length === 0) {
                return {
                    success: true,
                    dogWalkers: []
                };
            }



            return {
                success: true,
                dogWalkers: availableDogWalkers
            };

        } catch (error) {
            return {
                success: false,
                message: 'Failed to search dog walkers'
            };
        }
    }

    async queryAvailableDogWalkers(searchDate, timeSlots, userZone) {
        return this.prisma.$queryRaw`
        SELECT 
            dw.dw_id AS id,
            dw.dw_name AS name,
            dw.dw_pic AS pic,
            dw.dw_address AS address,
            dw.dw_zone AS zone,
            COALESCE(AVG(r.rating)::NUMERIC(10,2), 0) AS "meanRating",
            COUNT(r.rating) AS "ratingCount"
        FROM 
            dog_walker dw
        LEFT JOIN 
            walking_service ws ON dw.dw_id = ws.dw_id
        LEFT JOIN 
            review r ON ws.ws_id = r.ws_id
        WHERE 
            dw.dw_status = 1
            AND ${userZone}::text = ANY(dw.dw_zone)
            AND NOT EXISTS (
                SELECT 1
                FROM walking_service ws2
                WHERE 
                    ws2.dw_id = dw.dw_id
                    AND ws2.ws_date = ${searchDate}::date
                    AND ws2.ws_time && ${timeSlots}::smallint[]
            )
        GROUP BY 
            dw.dw_id, dw.dw_name, dw.dw_pic, dw.dw_address, dw.dw_zone
        ORDER BY
            "meanRating" DESC;
    `;
    }
}