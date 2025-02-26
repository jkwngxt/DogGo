import fs from 'fs/promises';
import path from 'path';
import { translations } from '@/utils/email/translations';
import { generateWelcomeEmail } from '@/utils/email/templates/welcomeEmail';
import { generateBookingEmail } from '@/utils/email/templates/bookingEmail';

export class EmailService {
    async sendWelcomeEmail(id, email, username, password) {
        const sanitizedUsername = username.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileName = `${id}-${sanitizedUsername}.html`;
        const emailPath = `/dog-walkers/welcome-emails/${fileName}`;
        const fullPath = path.join(process.cwd(), 'data', 'dog-walkers', 'welcome-emails', fileName);

        const emailContent = generateWelcomeEmail(email, username, password, translations);
        await this.#saveEmail(fullPath, emailContent);

        return emailPath;
    }

    async sendBookingNotification(walkingServiceId, dogWalkerUsername, bookingDetails) {
        const sanitizedUsername = dogWalkerUsername.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileName = `${walkingServiceId}-${sanitizedUsername}-booking.html`;
        const emailPath = path.join(process.cwd(), 'data', 'walking-service', 'booking-emails', fileName);

        const emailContent = generateBookingEmail(bookingDetails, translations);
        await this.#saveEmail(emailPath, emailContent);

        return emailPath;
    }

    async #saveEmail(fullPath, emailContent) {
        try {
            await fs.mkdir(path.dirname(fullPath), {recursive: true});
            await fs.writeFile(fullPath, emailContent);
        } catch (error) {
            throw error;
        }
    }
}