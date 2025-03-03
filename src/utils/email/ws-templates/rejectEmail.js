export function generateRejectionEmail(rejectionDetails) {
    const enText = {
        title: 'Walking Service Request Rejected',
        hello: 'Hello',
        rejected: 'We regret to inform you that your walking service request has been rejected by the dog walker.',
        details: 'Here are the details of your rejected booking:',
        serviceDetails: 'Service Information',
        date: 'Date:',
        time: 'Time:',
        dogWalker: 'Dog Walker:',
        dogWalkerInfo: 'Dog Walker Information',
        dogWalkerEmail: 'Email:',
        dogWalkerPhone: 'Phone:',
        userInfo: 'Your Information',
        name: 'Name:',
        email: 'Email:',
        phone: 'Phone:',
        address: 'Address:',
        dogInfo: 'Dog Information',
        numDogs: 'Number of Dogs:',
        breed: 'Breed:',
        findAnotherWalker: 'You can find another available dog walker by visiting our platform.',
        regards: 'Best regards,',
        team: 'The DogGo Team',
        questions: 'If you have any questions, feel free to reach out to us at',
        switchLanguage: 'ภาษาไทย',
        viewOtherWalkers: 'Find Another Walker',
        totalPrice: 'Total Price:',
        rejected_status: '✗ Your dog walking service has been rejected',
        dogWalkerZone: "Service Zone:",
        userZone: 'Zone:',


    };

    const thText = {
        title: 'คำขอบริการพาสุนัขเดินเล่นถูกปฏิเสธ',
        hello: 'สวัสดีคุณ',
        rejected: 'เราต้องขออภัยที่แจ้งให้ทราบว่าคำขอบริการพาสุนัขเดินเล่นของคุณถูกปฏิเสธโดย dog walker',
        details: 'นี่คือรายละเอียดการจองที่ถูกปฏิเสธ:',
        serviceDetails: 'ข้อมูลบริการ',
        date: 'วันที่:',
        time: 'เวลา:',
        dogWalker: 'dog walker',
        dogWalkerInfo: 'ข้อมูล Dog Walker',
        dogWalkerEmail: 'อีเมล:',
        dogWalkerPhone: 'เบอร์โทร:',
        userInfo: 'ข้อมูลของคุณ',
        name: 'ชื่อ:',
        email: 'อีเมล:',
        phone: 'เบอร์โทร:',
        address: 'ที่อยู่:',
        dogInfo: 'ข้อมูลสุนัข',
        numDogs: 'จำนวนสุนัข:',
        breed: 'สายพันธุ์:',
        findAnotherWalker: 'คุณสามารถหา dog walker คนอื่นที่ว่างได้โดยเข้าไปที่แพลตฟอร์มของเรา',
        regards: 'ขอแสดงความนับถือ,',
        team: 'ทีม DogGo',
        questions: 'หากมีข้อสงสัย โปรดติดต่อเราที่',
        switchLanguage: 'English',
        viewOtherWalkers: 'หา dog walker คนอื่น',
        totalPrice: 'ราคารวม:',
        rejected_status: '✗ บริการพาสุนัขเดินเล่นของคุณถูกปฏิเสธ',
        dogWalkerZone: "เขตที่ให้บริการ:",
        userZone: 'เขตที่อยู่:',

    };

    const {
        userName,
        userTel,
        userAddress,
        dogs,
        serviceDate,
        startSlot,
        endSlot,
        dogWalkerName,
        dogWalkerEmail,
        dogWalkerTel,
        totalPrice,
        dogWalkerZone,
        userZone
    } = rejectionDetails;

    const START_TIME = 9;
    // e.g. [1,2,3] = 9.00 - 12.00
    let startHour = START_TIME + startSlot - 1;
    let endHour = START_TIME + endSlot;

    let startTime = startHour.toString().padStart(2, '0') + ':00';
    let endTime = endHour.toString().padStart(2, '0') + ':00';

    let dateStr = new Date(serviceDate);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    let dateEN = dateStr.toLocaleDateString('en-US', options)
    let dateTH = dateStr.toLocaleDateString('th-TH', options)

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Service Request / คำขอบริการถูกปฏิเสธ</title>
        <style>
            body {
                font-family: 'Segoe UI', Roboto, Arial, sans-serif;
                background-color: #f8f9fa;
                color: #333;
                padding: 20px;
                text-align: center;
                margin: 0;
            }
            .container {
                background-color: #ffffff;
                border-radius: 16px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                padding: 40px;
                max-width: 700px;
                margin: 20px auto;
                text-align: left;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                width: 120px;
                height: 120px;
                margin: 0 auto 20px;
                background-color: #616161;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 60px;
            }
            h1 {
                color: #1e3a8a;
                text-align: center;
                font-size: 28px;
                margin-top: 0;
            }
            p, li {
                font-size: 16px;
                line-height: 1.7;
                color: #4b5563;
            }
            .greeting {
                font-size: 18px;
                font-weight: 500;
                color: #111827;
            }
            .details {
                background-color: #f9fafb;
                padding: 25px;
                border-radius: 12px;
                margin-bottom: 25px;
                border-left: 4px solid #4a4a4a;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
            }
            .details h2 {
                color: #4a4a4a;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 10px;
                margin-top: 0;
                font-size: 20px;
                display: flex;
                align-items: center;
            }
            .icon-space {
                margin-right: 10px;
            }
            .detail-row {
                display: flex;
                margin-bottom: 8px;
            }
            .detail-label {
                font-weight: bold;
                width: auto;
                color: #4b5563;
                margin-right: 10px;
            }
            .detail-value {
                flex: 1;
                width: auto;
                color: #111827;
            }
            .button {
                display: block;
                background: linear-gradient(135deg, #f87171 0%, #4a4a4a 100%);
                color: white;
                padding: 16px;
                text-decoration: none;
                border-radius: 8px;
                text-align: center;
                font-weight: bold;
                margin: 30px auto;
                max-width: 300px;
                box-shadow: 0 4px 6px rgba(233, 73, 73, 0.2);
                transition: all 0.2s ease;
            }
            .button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 8px rgba(233, 73, 73, 0.3);
            }
            .footer {
                text-align: center;
                font-size: 14px;
                color: #6b7280;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
            }
            .footer a {
                color: #2668E3;
                text-decoration: none;
            }
            .footer a:hover {
                text-decoration: underline;
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
            /* Languages */
            .th-lang, .en-lang {
                display: none;
            }

            /* Status Banner */
            .status-banner {
                background: linear-gradient(135deg, #8a8a8a 0%, #4a4a4a 100%);
                color: white;
                padding: 12px;
                border-radius: 10px;
                text-align: center;
                margin-bottom: 25px;
                font-weight: 600;
                box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            }
            /* Reason box */
            .reason-box {
                background-color: #fee2e2;
                border-radius: 8px;
                padding: 15px;
                margin-top: 15px;
                border-left: 3px solid #424242;
            }

            /* Thai Language Styles */
            .th-lang, .en-lang {
                display: none;
            }
            /* Show English by default */
            .en-lang {
                display: block;
            }
            
            ul {
                padding-left: 20px;
            }
            
            li {
                margin-bottom: 10px;
            }
            
            @media (max-width: 768px) {
                .container {
                    padding: 25px 20px;
                }
                .logo {
                    width: 100px;
                    height: 100px;
                    font-size: 50px;
                }
                .details {
                    padding: 20px 15px;
                }
                .detail-row {
                    flex-direction: column;
                }
                .detail-label {
                    width: 100%;
                    margin-bottom: 3px;
                }
                .button {
                    width: 100%;
                }
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
            
            <div class="header">
                <div class="logo">🐕</div>
                <h1 class="en-lang">${enText.title}</h1>
                <h1 class="th-lang">${thText.title}</h1>
            </div>
            
            <div class="status-banner">
                <span class="en-lang">${enText.rejected_status}</span>
                <span class="th-lang">${thText.rejected_status}</span>
            </div>
            
            <p class="greeting en-lang">${enText.hello} ${userName},</p>
            <p class="greeting th-lang">${thText.hello} ${userName},</p>
            
            <p class="en-lang">${enText.rejected}</p>
            <p class="th-lang">${thText.rejected}</p>
            
            <div class="details">
                <h2><span class="icon-space">📅</span><span class="en-lang">${enText.serviceDetails}</span><span class="th-lang">${thText.serviceDetails}</span></h2>
                
                <div class="detail-row">
                    <div class="detail-label en-lang">${enText.date}</div>
                    <div class="detail-label th-lang">${thText.date}</div>
                    <div class="detail-value en-lang">${dateEN}</div>
                    <div class="detail-value th-lang">${dateTH}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label en-lang">${enText.time}</div>
                    <div class="detail-label th-lang">${thText.time}</div>
                    <div class="detail-value">${startTime} - ${endTime}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label en-lang">${enText.totalPrice}</div>
                    <div class="detail-label th-lang">${thText.totalPrice}</div>
                    <div class="detail-value">${totalPrice} THB</div>
                </div>
            </div>
            
            <div class="details">
                <h2><span class="icon-space">🚶🏻‍♂️</span><span class="en-lang">${enText.dogWalkerInfo}</span><span class="th-lang">${thText.dogWalkerInfo}</span></h2>
                
                <div class="detail-row">
                    <div class="detail-label en-lang">${enText.name}</div>
                    <div class="detail-label th-lang">${thText.name}</div>
                    <div class="detail-value">${dogWalkerName}</div>
                </div>
                
                ${dogWalkerEmail ? `
                <div class="detail-row">
                    <div class="detail-label en-lang">${enText.dogWalkerEmail}</div>
                    <div class="detail-label th-lang">${thText.dogWalkerEmail}</div>
                    <div class="detail-value">${dogWalkerEmail}</div>
                </div>
                ` : ''}
                
                ${dogWalkerTel ? `
                <div class="detail-row">
                    <div class="detail-label en-lang">${enText.dogWalkerPhone}</div>
                    <div class="detail-label th-lang">${thText.dogWalkerPhone}</div>
                    <div class="detail-value">${dogWalkerTel}</div>
                </div>
                ` : ''}
                
                <div class="detail-row">
                    <div class="detail-label en-lang">${enText.dogWalkerZone}</div>
                    <div class="detail-label th-lang">${thText.dogWalkerZone}</div>
                    <div class="detail-value">${dogWalkerZone && dogWalkerZone.length > 0 ? dogWalkerZone.join(', ') : '-'}</div>                   
                </div>
             
            </div>
            
            <div class="details">
                <h2><span class="icon-space">👤</span><span class="en-lang">${enText.userInfo}</span><span class="th-lang">${thText.userInfo}</span></h2>
                
                <div class="detail-row">
                    <div class="detail-label en-lang">${enText.name}</div>
                    <div class="detail-label th-lang">${thText.name}</div>
                    <div class="detail-value">${userName}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label en-lang">${enText.phone}</div>
                    <div class="detail-label th-lang">${thText.phone}</div>
                    <div class="detail-value">${userTel}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label en-lang">${enText.address}</div>
                    <div class="detail-label th-lang">${thText.address}</div>
                    <div class="detail-value">${userAddress}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label en-lang">${enText.userZone}</div>
                    <div class="detail-label th-lang">${thText.userZone}</div>
                    <div class="detail-value">${userZone}</div>
                </div>
            </div>
            
            <div class="details">
                <h2><span class="icon-space">🐶</span><span class="en-lang">${enText.dogInfo}</span><span class="th-lang">${thText.dogInfo}</span></h2>
                
                <div class="detail-row">
                    <div class="detail-label en-lang">${enText.numDogs}</div>
                    <div class="detail-label th-lang">${thText.numDogs}</div>
                    <div class="detail-value">${dogs.length}</div>
                </div>
                
                <ul>
                    ${dogs.map(dog => `
                       <li>
                            <strong>${dog.name}</strong><br>
                            <span class="flex w-fit">
                                <span class="w-fit en-lang">${enText.breed} ${dog.breed}</span>
                                <span class="th-lang">${thText.breed} ${dog.breed}</span>
                            </span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <p class="en-lang">${enText.findAnotherWalker}</p>
            <p class="th-lang">${thText.findAnotherWalker}</p>
            
            <p class="en-lang">${enText.regards}<br><strong>${enText.team}</strong></p>
            <p class="th-lang">${thText.regards}<br><strong>${thText.team}</strong></p>
            
            <div class="footer">
                <p class="en-lang">${enText.questions} <a href="mailto:support@doggo.com">support@doggo.com</a></p>
                <p class="th-lang">${thText.questions} <a href="mailto:support@doggo.com">support@doggo.com</a></p>
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
            
            // Show English by default
            document.addEventListener('DOMContentLoaded', function() {
                const thElements = document.querySelectorAll('.th-lang');
                const enElements = document.querySelectorAll('.en-lang');
                
                thElements.forEach(el => {
                    el.style.display = 'none';
                });
                
                enElements.forEach(el => {
                    el.style.display = 'block';
                });
            });
        </script>
    </body>
    </html>
`;
}