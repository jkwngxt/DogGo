export function generateAcceptanceEmail(acceptanceDetails) {
    const enText = {
        title: 'Walking Service Request Accepted! 🎉',
        hello: 'Hello',
        accepted: 'Great news! Your walking service request has been accepted by the dog walker. Please check our website for more details and updates.',
        details: 'Here are the details of your confirmed booking:',
        serviceDetails: 'Service Information',
        date: 'Date:',
        time: 'Time:',
        totalPrice: 'Total Price:',
        dogWalker: 'Dog Walker:',
        contactInfo: 'Contact Information:',
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
        regards: 'Best regards,',
        team: 'The DogGo Team',
        questions: 'If you have any questions, feel free to reach out to us at',
        switchLanguage: 'ภาษาไทย',
        confirmed: '✓ Your dog walking service is confirmed',
        greeting: 'Hello',
        greatNews: 'Great news! Your dog walking request has been accepted by one of our professional walkers. Here are the details of your booking:',
        walkerContact: 'Your dog walker will get in touch shortly before your scheduled appointment. Please be ready for a smooth experience.',
        needHelp: 'Need help? Contact us at',
        dogWalkerZone: "Service Zone:",
        userZone: 'Zone:',
    };

    const thText = {
        title: 'คำขอบริการพาสุนัขเดินเล่นได้รับการยอมรับแล้ว! 🎉',
        hello: 'สวัสดีคุณ',
        accepted: 'ข่าวดี! คำขอบริการพาสุนัขเดินเล่นของคุณได้รับการยอมรับจากผู้เดินสุนัขแล้ว กรุณาตรวจสอบรายละเอียดและอัพเดทเพิ่มเติมที่เว็บไซต์ของเรา',
        details: 'นี่คือรายละเอียดการจองที่ยืนยันแล้ว:',
        serviceDetails: 'ข้อมูลบริการ',
        date: 'วันที่:',
        time: 'เวลา:',
        totalPrice: 'ราคารวม:',
        dogWalker: 'ผู้เดินสุนัข:',
        contactInfo: 'ข้อมูลติดต่อ:',
        dogWalkerInfo: 'ข้อมูลผู้เดินสุนัข',
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
        regards: 'ขอแสดงความนับถือ,',
        team: 'ทีม DogGo',
        questions: 'หากมีข้อสงสัย โปรดติดต่อเราที่',
        switchLanguage: 'English',
        confirmed: '✓ บริการพาสุนัขเดินเล่นของคุณได้รับการยืนยันแล้ว',
        greeting: 'สวัสดี',
        greatNews: 'ข่าวดี! คำขอพาสุนัขเดินเล่นของคุณได้รับการยอมรับจาก Dog Walker ที่เป็นมืออาชีพของเรา นี่คือรายละเอียดการจองของคุณ:',
        walkerContact: 'ผู้ดูแลสุนัขจะติดต่อคุณก่อนถึงเวลานัดหมายเล็กน้อย โปรดเตรียมตัวให้พร้อมเพื่อความสะดวกสบายของคุณ',
        needHelp: 'ต้องการความช่วยเหลือ? ติดต่อเราที่',
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
        totalPrice,
        dogWalkerName,
        dogWalkerTel,
        dogWalkerEmail,
        dogWalkerZone,
        userZone
    } = acceptanceDetails;

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
    <title>Booking Accepted / การจองได้รับการยอมรับ</title>
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
            background-color: #6498FA;
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
            border-left: 4px solid #2668E3;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        }
        .details h2 {
            color: #2668E3;
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
            color: #111827;
            width: auto;
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
            background: linear-gradient(135deg, #6498FA 0%, #2668E3 100%);
            color: white;
            padding: 12px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 25px;
            font-weight: 600;
            box-shadow: 0 4px 6px rgba(52, 211, 153, 0.2);
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
            <span class="en-lang">${enText.confirmed}</span>
            <span class="th-lang">${thText.confirmed}</span>
        </div>
        
        <p class="greeting en-lang">${enText.greeting} ${userName},</p>
        <p class="greeting th-lang">${thText.greeting} ${userName},</p>
        
        <p class="en-lang">${enText.greatNews}</p>
        <p class="th-lang">${thText.greatNews}</p>
        
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
            
            <div class="detail-row">
                <div class="detail-label en-lang">${enText.dogWalkerEmail}</div>
                <div class="detail-label th-lang">${thText.dogWalkerEmail}</div>
                <div class="detail-value">${dogWalkerEmail || '-'}</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-label en-lang">${enText.dogWalkerPhone}</div>
                <div class="detail-label th-lang">${thText.dogWalkerPhone}</div>
                <div class="detail-value">${dogWalkerTel || '-'}</div>
            </div>
            
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
                            <span class="en-lang">${enText.breed} ${dog.breed}</span>
                            <span class="th-lang">${thText.breed} ${dog.breed}</span>
                        </span>
                    </li>
                `).join('')}
            </ul>
        </div>
            
        <p class="en-lang">${enText.walkerContact}</p>
        <p class="th-lang">${thText.walkerContact}</p>
        
        <p class="en-lang">${enText.regards}<br><strong>${enText.team}</strong></p>
        <p class="th-lang">${thText.regards}<br><strong>${thText.team}</strong></p>
        
        <div class="footer">
            <p class="en-lang">${enText.needHelp} <a href="mailto:support@doggo.com">support@doggo.com</a></p>
            <p class="th-lang">${thText.needHelp} <a href="mailto:support@doggo.com">support@doggo.com</a></p>
        </div>
    </div>
    
    <script>
        function toggleLanguage() {
            const enElements = document.querySelectorAll('.en-lang');
            const thElements = document.querySelectorAll('.th-lang');
            
            for(let el of enElements) {
                el.style.display = el.style.display === 'none' ? 'block' : 'none';
            }
            
            for(let el of thElements) {
                el.style.display = el.style.display === 'none' ? 'block' : 'none';
            }
        }
        
        // Show English by default
        document.addEventListener('DOMContentLoaded', function() {
            const thElements = document.querySelectorAll('.th-lang');
            const enElements = document.querySelectorAll('.en-lang');
            
            for(let el of thElements) {
                el.style.display = 'none';
            }
            
            for(let el of enElements) {
                el.style.display = 'block';
            }
        });
    </script>
</body>
</html>
`;
}