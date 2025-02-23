import nodemailer from 'nodemailer';

export class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendWelcomeEmail(email, username, password) {
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Welcome to DogGo - Your Dog Walker Account',
            html: `
                <h1>Welcome to DogGo!</h1>
                <p>Your account has been created successfully.</p>
                <p>Here are your login credentials:</p>
                <p><strong>Username:</strong> ${username}</p>
                <p><strong>Password:</strong> ${password}</p>
                <p>Please change your password after your first login.</p>
                <p>Best regards,<br>DogGo Team</p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Email sending failed:', error);
            return false;
        }
    }
}