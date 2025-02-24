import fs from 'fs/promises';
import path from 'path';

export class EmailService {
    async sendWelcomeEmail(id, email, username, password) {
        const emailContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to DogGo</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f7f7f7;
                        color: #333;
                        padding: 20px;
                    }
                    .container {
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        padding: 30px;
                        max-width: 600px;
                        margin: 0 auto;
                    }
                    h1 {
                        color: #2668E3;
                        text-align: center;
                    }
                    p {
                        font-size: 16px;
                        line-height: 1.6;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        font-size: 14px;
                        color: #888;
                    }
                    .button {
                        display: inline-block;
                        background-color: #2668E3;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Welcome to DogGo!</h1>
                    <p>Your account has been created successfully.</p>
                    <p>Here are your login credentials:</p>
                    <p><strong>Username:</strong> ${username}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Password:</strong> ${password}</p>
                    <p>Please change your password after your first login.</p>
                    <p>Best regards,<br>DogGo Team</p>
                    <a href="http://localhost:3000/" class="button">Login Now</a>
                    <div class="footer">
                        <p>If you didn't create an account, please ignore this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const sanitizedUsername = username.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileName = `${id}-${sanitizedUsername}.html`;
        const emailPath = `/dog-walkers/welcome-emails/${fileName}`;
        const fullPath = path.join(process.cwd(), 'data', 'dog-walkers', 'welcome-emails', fileName);

        try {
            await fs.mkdir(path.dirname(fullPath), { recursive: true });
            await fs.writeFile(fullPath, emailContent);
            return emailPath;
        } catch (error) {
            throw error;
        }
    }
}