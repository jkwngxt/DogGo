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

        await this.#saveEmail(fullPath, emailContent);
        return emailPath;
    }

    async sendBookingNotification(walkingServiceId, dogWalkerUsername, bookingDetails) {
        const {
            userName,
            userEmail,
            userTel,
            userAddress,
            dogs,
            serviceDate,
            startSlot,
            endSlot,
            totalPrice
        } = bookingDetails;

        const START_TIME = 9
        let startHour = START_TIME + startSlot - 1;
        let endHour = START_TIME + endSlot - 1;

        let startTime = startHour.toString().padStart(2, '0') + ':00';
        let endTime = endHour.toString().padStart(2, '0') + ':00';

        const emailContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Booking Confirmation</title>
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
                    max-width: 800px;
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
                .details {
                    background-color: #f7fafc;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                .button {
                    display: inline-block;
                    background-color: #2668E3;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>New Booking Confirmation 🐕</h1>
                <p>Hello Dog Walker,</p>
                <p>You've received a new booking from <strong>${userName}</strong>! Here are the details:</p>

                <div class="details">
                    <h2>📅 Service Details</h2>
                    <p>
                        <strong>Date:</strong> ${serviceDate}<br>
                        <strong>Time:</strong> ${startTime} - ${endTime}<br>
                        <strong>Total Price:</strong> ${totalPrice} THB
                    </p>
                </div>

                <div class="details">
                    <h2>👤 User Information</h2>
                    <p>
                        <strong>Name:</strong> ${userName}<br>
                        <strong>Email:</strong> ${userEmail}<br>
                        <strong>Phone:</strong> ${userTel}<br>
                        <strong>Address:</strong> ${userAddress}
                    </p>
                </div>

                <div class="details">
                    <h2>🐶 Dog Information</h2>
                    <p><strong>Number of Dogs:</strong> ${dogs.length}</p>
                    <ul>
                        ${dogs.map(dog => `
                           <li style="margin-bottom: 5px;">
                                <strong>${dog.name}</strong><br>
                                Breed: ${dog.breed}
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <p>Please confirm the booking details and contact the user if needed.</p>
                <p>Best regards,<br><strong>DogGo Team</strong></p>

                <div class="footer">
                    <p>If you have any questions, feel free to contact us at <a href="mailto:support@doggo.com">support@doggo.com</a>.</p>
                </div>
            </div>
        </body>
        </html>
    `;

        console.log()
        const sanitizedUsername = dogWalkerUsername.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileName = `${walkingServiceId}-${sanitizedUsername}-booking.html`;
        const emailPath = path.join(process.cwd(), 'data', 'walking-service', 'booking-emails', fileName);

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