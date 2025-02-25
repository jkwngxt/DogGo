// set service area for dog walker
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export class SetZoneController {

    async updateProfile(data) {
        try {
            const { id, password, tel, address, zone } = data;

            // front end check password, tel, address, zone (select zone at least 1)
            if (!id || !tel || !address || !Array.isArray(zone) || zone.length === 0) {
                return { success: false, message: "Invalid data. Please fill in all required fields." };
            }

            let updateData = {
                tel,
                address,
                zone,
                status: 1, // change status to ready
            };

            // hash and update password if provided
            if (password) {
                if (password.length < 8) {
                    return { success: false, message: "Password must be at least 8 characters long." };
                }
                updateData.password = await bcrypt.hash(password, 10);
            }

            const updatedDogWalker = await prisma.dogWalker.update({
                where: { id: parseInt(id) },
                data: updateData,
            });

            return { success: true, message: "Update set service area data successful.", dogWalker: updatedDogWalker };

        } catch (error) {
            return { success: false, message: "Unsuccessful update data.", error };
        }
    }
}