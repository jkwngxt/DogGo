export function generateBookingEmail(bookingDetails) {
    const translations = {
        en: {
            title: 'New Booking Request 🐕',
            hello: 'Hello Dog Walker,',
            newBooking: 'You have received a new booking request from',
            details: 'Booking details:',
            serviceDetails: '📅 Service Information',
            date: 'Date:',
            time: 'Time:',
            totalPrice: 'Total Price:',
            userInfo: '👤 Customer Information',
            name: 'Name:',
            email: 'Email:',
            phone: 'Phone:',
            address: 'Address:',
            dogInfo: '🐶 Dog Information',
            numDogs: 'Number of Dogs:',
            breed: 'Breed:',
            dogWalkerInfo: '🚶🏻‍♂️ Dog Walker Information',
            dogWalkerName: 'Name:',
            dogWalkerEmail: 'Email:',
            dogWalkerPhone: 'Phone:',
            confirmDetails: 'Please review the booking details and contact the customer if necessary.',
            regards: 'Best regards,',
            team: 'The DogGo Team',
            questions: 'If you have any questions, feel free to reach out to us at',
            switchLanguage: 'ภาษาไทย',
            dogWalkerZone: "Service Zone:",
            userZone: 'Zone:',
        },
        th: {
            title: 'คำขอจองบริการใหม่ 🐕',
            hello: 'สวัสดี Dog Walker,',
            newBooking: 'คุณได้รับคำขอใหม่เพื่อจองบริการจาก',
            details: 'รายละเอียดการจองดังนี้',
            serviceDetails: '📅 ข้อมูลบริการ',
            date: 'วันที่:',
            time: 'เวลา:',
            totalPrice: 'ราคารวม:',
            userInfo: '👤 ข้อมูลลูกค้า',
            name: 'ชื่อ:',
            email: 'อีเมล:',
            phone: 'เบอร์โทร:',
            address: 'ที่อยู่:',
            dogInfo: '🐶 ข้อมูลสุนัข',
            numDogs: 'จำนวนสุนัข:',
            breed: 'สายพันธุ์:',
            dogWalkerInfo: '🚶🏻‍♂️ ข้อมูลคนเดินสุนัข',
            dogWalkerName: 'ชื่อ:',
            dogWalkerEmail: 'อีเมล:',
            dogWalkerPhone: 'เบอร์โทร:',
            confirmDetails: 'โปรดตรวจสอบรายละเอียดการจอง และติดต่อผู้ใช้หากจำเป็น',
            regards: 'ขอแสดงความนับถือ,',
            team: 'ทีม DogGo',
            questions: 'หากมีข้อสงสัย โปรดติดต่อเราที่',
            switchLanguage: 'English',
            dogWalkerZone: "เขตที่ให้บริการ:",
            userZone: 'เขตที่อยู่:',
        }
    };
    const enText = translations.en;
    const thText = translations.th;

    const {
        userName,
        userEmail,
        userTel,
        userAddress,
        dogs,
        serviceDate,
        startSlot,
        endSlot,
        totalPrice,
        dogWalkerName,
        dogWalkerEmail,
        dogWalkerTel,
        dogWalkerZone,
        userZone
    } = bookingDetails;

    const START_TIME = 9;
    // e.g. [1,2,3] = 9.00 - 12.00
    let startHour = START_TIME + startSlot - 1;
    let endHour = START_TIME + endSlot;

    let startTime = startHour.toString().padStart(2, '0') + ':00';
    let endTime = endHour.toString().padStart(2, '0') + ':00';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation / ยืนยันการจอง</title>
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
            .language-switch {
                text-align: right;
                margin-bottom: 10px;
                font-size: 16px;
            }
            .language-link {
                color: #666;
                text-decoration: underline;
                cursor: pointer;
            }
            /* Languages - Both Thai and English have identical styling */
            .th-lang, .en-lang {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            /* Show English by default, hide Thai */
            .en-lang {
                display: block;
            }
            .th-lang {
                display: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="language-switch">
                <a class="language-link" onclick="toggleLanguage()">
                    <span class="en-lang">${enText.switchLanguage}</span>
                    <span class="th-lang">${thText.switchLanguage}</span>
                </a>
            </div>
            
            <!-- English Content -->
            <div class="en-lang">
                <h1>${enText.title}</h1>
                <p>${enText.hello}</p>
                <p>${enText.newBooking} <strong>${userName}</strong>! ${enText.details}</p>

                <div class="details">
                    <h2>${enText.serviceDetails}</h2>
                    <p>
                        <strong>${enText.date}</strong> ${serviceDate}<br>
                        <strong>${enText.time}</strong> ${startTime} - ${endTime}<br>
                        <strong>${enText.totalPrice}</strong> ${totalPrice} THB
                    </p>
                </div>

                <div class="details">
                    <h2>${enText.userInfo}</h2>
                    <p>
                        <strong>${enText.name}</strong> ${userName}<br>
                        <strong>${enText.email}</strong> ${userEmail}<br>
                        <strong>${enText.phone}</strong> ${userTel}<br>
                        <strong>${enText.address}</strong> ${userAddress}<br>
                        <strong>${thText.userZone}</strong> ${userZone}
                    </p>
                </div>

                ${dogWalkerName ? `
                <div class="details">
                    <h2>${enText.dogWalkerInfo}</h2>
                    <p>
                        <strong>${enText.dogWalkerName}</strong> ${dogWalkerName}<br>
                        <strong>${enText.dogWalkerEmail}</strong> ${dogWalkerEmail || '-'}<br>
                        <strong>${enText.dogWalkerPhone}</strong> ${dogWalkerTel || '-'}<br>
                        <strong>${enText.dogWalkerZone}</strong> ${dogWalkerZone && dogWalkerZone.length > 0 ? dogWalkerZone.join(', ') : '-'}                 
                    </p>
                </div>
                ` : ''}


                <div class="details">
                    <h2>${enText.dogInfo}</h2>
                    <p><strong>${enText.numDogs}</strong> ${dogs.length}</p>
                    <ul>
                        ${dogs.map(dog => `
                           <li style="margin-bottom: 5px;">
                                <strong>${dog.name}</strong><br>
                                ${enText.breed} ${dog.breed}
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <p>${enText.confirmDetails}</p>
                <p>${enText.regards}<br><strong>${enText.team}</strong></p>

                <div class="footer">
                    <p>${enText.questions} <a href="mailto:support@doggo.com">support@doggo.com</a>.</p>
                </div>
            </div>
            
            <!-- Thai Content -->
            <div class="th-lang">
                <h1>${thText.title}</h1>
                <p>${thText.hello}</p>
                <p>${thText.newBooking} <strong>${userName}</strong>! ${thText.details}</p>

                <div class="details">
                    <h2>${thText.serviceDetails}</h2>
                    <p>
                        <strong>${thText.date}</strong> ${serviceDate}<br>
                        <strong>${thText.time}</strong> ${startTime} - ${endTime}<br>
                        <strong>${thText.totalPrice}</strong> ${totalPrice} THB
                    </p>
                </div>

                <div class="details">
                    <h2>${thText.userInfo}</h2>
                    <p>
                        <strong>${thText.name}</strong> ${userName}<br>
                        <strong>${thText.email}</strong> ${userEmail}<br>
                        <strong>${thText.phone}</strong> ${userTel}<br>
                        <strong>${thText.address}</strong> ${userAddress}<br>
                        <strong>${thText.userZone}</strong> ${userZone}
                    </p>
                </div>

                ${dogWalkerName ? `
                <div class="details">
                    <h2>${thText.dogWalkerInfo}</h2>
                    <p>
                        <strong>${thText.dogWalkerName}</strong> ${dogWalkerName}<br>
                        <strong>${thText.dogWalkerEmail}</strong> ${dogWalkerEmail || '-'}<br>
                        <strong>${thText.dogWalkerPhone}</strong> ${dogWalkerTel || '-'}<br>
                        <strong>${thText.dogWalkerZone}</strong> ${dogWalkerZone && dogWalkerZone.length > 0 ? dogWalkerZone.join(', ') : '-'}                 
                    </p>
                </div>
                ` : ''}

                <div class="details">
                    <h2>${thText.dogInfo}</h2>
                    <p><strong>${thText.numDogs}</strong> ${dogs.length}</p>
                    <ul>
                        ${dogs.map(dog => `
                           <li style="margin-bottom: 5px;">
                                <strong>${dog.name}</strong><br>
                                ${thText.breed} ${dog.breed}
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <p>${thText.confirmDetails}</p>
                <p>${thText.regards}<br><strong>${thText.team}</strong></p>

                <div class="footer">
                    <p>${thText.questions} <a href="mailto:support@doggo.com">support@doggo.com</a>.</p>
                </div>
            </div>
            
            <script>
                function toggleLanguage() {
                    const enElements = document.querySelectorAll('.en-lang');
                    const thElements = document.querySelectorAll('.th-lang');
                    
                    // Check if English is currently visible
                    const isEnglishVisible = window.getComputedStyle(enElements[0]).display !== 'none';
                    
                    // Toggle visibility
                    enElements.forEach(el => {
                        el.style.display = isEnglishVisible ? 'none' : 'block';
                    });
                    
                    thElements.forEach(el => {
                        el.style.display = isEnglishVisible ? 'block' : 'none';
                    });
                }
            </script>
        </div>
    </body>
    </html>
`;
}