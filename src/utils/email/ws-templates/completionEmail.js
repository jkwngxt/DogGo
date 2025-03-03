export function generateCompletionEmail(completionDetails) {
    const enText = {
        title: 'Walking Service Completed! 🎉',
        hello: 'Hello',
        completed: 'Great job! The walking service has been marked as completed. Your payment is being processed and will be transferred to your account soon.',
        details: 'Here are the details of the completed service:',
        serviceDetails: 'Service Information',
        date: 'Date:',
        time: 'Time:',
        totalPayment: 'Total Payment:',
        owner: 'Pet Owner:',
        ownerInfo: 'Pet Owner Information',
        ownerEmail: 'Email:',
        ownerPhone: 'Phone:',
        ownerAddress: 'Address:',
        ownerZone: 'Zone:',
        paymentInfo: 'Payment Information',
        paymentStatus: 'Payment Status:',
        paymentExpected: 'Expected Payment Date:',
        dogInfo: 'Dog Information',
        numDogs: 'Number of Dogs:',
        breed: 'Breed:',
        regards: 'Best regards,',
        team: 'The DogGo Team',
        questions: 'If you have any questions, feel free to reach out to us at',
        switchLanguage: 'ภาษาไทย',
        confirmed: '✓ Walking service completed successfully',
        greeting: 'Hello',
        greatNews: 'Congratulations! The walking service you provided has been marked as completed. Your payment is now being processed.',
        paymentNote: 'Payment will be transferred to your account within 3-5 business days.',
        needHelp: 'Need help? Contact us at',
    };

    const thText = {
        title: 'บริการพาสุนัขเดินเล่นเสร็จสิ้นแล้ว! 🎉',
        hello: 'สวัสดีคุณ',
        completed: 'ยอดเยี่ยม! บริการพาสุนัขเดินเล่นได้รับการทำเครื่องหมายว่าเสร็จสิ้นแล้ว การชำระเงินของคุณกำลังได้รับการประมวลผลและจะถูกโอนเข้าบัญชีของคุณเร็วๆ นี้',
        details: 'นี่คือรายละเอียดของบริการที่เสร็จสิ้น:',
        serviceDetails: 'ข้อมูลบริการ',
        date: 'วันที่:',
        time: 'เวลา:',
        totalPayment: 'การชำระเงินทั้งหมด:',
        owner: 'เจ้าของสัตว์เลี้ยง:',
        ownerInfo: 'ข้อมูลเจ้าของสัตว์เลี้ยง',
        ownerEmail: 'อีเมล:',
        ownerPhone: 'เบอร์โทร:',
        ownerAddress: 'ที่อยู่:',
        ownerZone: 'เขต:',
        paymentInfo: 'ข้อมูลการชำระเงิน',
        paymentStatus: 'สถานะการชำระเงิน:',
        paymentExpected: 'วันที่คาดว่าจะได้รับการชำระเงิน:',
        dogInfo: 'ข้อมูลสุนัข',
        numDogs: 'จำนวนสุนัข:',
        breed: 'สายพันธุ์:',
        regards: 'ขอแสดงความนับถือ,',
        team: 'ทีม DogGo',
        questions: 'หากมีข้อสงสัย โปรดติดต่อเราที่',
        switchLanguage: 'English',
        confirmed: '✓ บริการพาสุนัขเดินเล่นเสร็จสิ้นเรียบร้อยแล้ว',
        greeting: 'สวัสดี',
        greatNews: 'ขอแสดงความยินดี! บริการพาสุนัขเดินเล่นที่คุณให้บริการได้รับการทำเครื่องหมายว่าเสร็จสิ้นแล้ว การชำระเงินของคุณกำลังได้รับการประมวลผล',
        paymentNote: 'การชำระเงินจะถูกโอนเข้าบัญชีของคุณภายใน 3-5 วันทำการ',
        needHelp: 'ต้องการความช่วยเหลือ? ติดต่อเราที่',
    };

    const {
        dogWalkerName,
        userName,
        userEmail,
        userTel,
        userAddress,
        userZone,
        dogs,
        serviceDate,
        startSlot,
        endSlot,
        totalPrice
    } = completionDetails;

    const START_TIME = 9;
    // e.g. [1,2,3] = 9.00 - 12.00
    let startHour = START_TIME + startSlot - 1;
    let endHour = START_TIME + endSlot;

    let startTime = startHour.toString().padStart(2, '0') + ':00';
    let endTime = endHour.toString().padStart(2, '0') + ':00';

    // Calculate expected payment date (3-5 business days from now)
    const currentDate = new Date();
    const paymentDate = new Date(currentDate);
    paymentDate.setDate(currentDate.getDate() + 5); // Using maximum (5 days)
    const formattedPaymentDate = paymentDate.toISOString().split('T')[0];

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
    <title>Service Completed / บริการเสร็จสิ้น</title>
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
            background-color: #1cba8a;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 60px;
        }
        h1 {
            color: #056347;
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
            border-left: 4px solid #059669;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        }
        .details h2 {
            color: #059669;
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
            color: #059669;
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
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            color: white;
            padding: 12px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 25px;
            font-weight: 600;
            box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);
        }
        /* Payment Info Banner */
        .payment-banner {
            background-color: #FEF3C7;
            border-left: 4px solid #F59E0B;
            color: #92400E;
            padding: 15px;
            border-radius: 10px;
            margin: 25px 0;
            font-weight: 500;
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
        
        <p class="greeting en-lang">${enText.greeting} ${dogWalkerName},</p>
        <p class="greeting th-lang">${thText.greeting} ${dogWalkerName},</p>
        
        <p class="en-lang">${enText.greatNews}</p>
        <p class="th-lang">${thText.greatNews}</p>
        
        <div class="payment-banner">
            <span class="en-lang">💰 ${enText.paymentNote}</span>
            <span class="th-lang">💰 ${thText.paymentNote}</span>
        </div>
        
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
                <div class="detail-label en-lang">${enText.totalPayment}</div>
                <div class="detail-label th-lang">${thText.totalPayment}</div>
                <div class="detail-value">${totalPrice} THB</div>
            </div>
        </div>
        
        <div class="details">
            <h2><span class="icon-space">💳</span><span class="en-lang">${enText.paymentInfo}</span><span class="th-lang">${thText.paymentInfo}</span></h2>
            
            <div class="detail-row">
                <div class="detail-label en-lang">${enText.paymentStatus}</div>
                <div class="detail-label th-lang">${thText.paymentStatus}</div>
                <div class="detail-value th-lang">รอการดำเนินการ</div>
                <div class="detail-value en-lang">Pending Clearance</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-label en-lang">${enText.paymentExpected}</div>
                <div class="detail-label th-lang">${thText.paymentExpected}</div>
                <div class="detail-value">${formattedPaymentDate}</div>
            </div>
        </div>
        
        <div class="details">
            <h2><span class="icon-space">👤</span><span class="en-lang">${enText.ownerInfo}</span><span class="th-lang">${thText.ownerInfo}</span></h2>
            
            <div class="detail-row">
                <div class="detail-label en-lang">${enText.owner}</div>
                <div class="detail-label th-lang">${thText.owner}</div>
                <div class="detail-value">${userName}</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-label en-lang">${enText.ownerEmail}</div>
                <div class="detail-label th-lang">${thText.ownerEmail}</div>
                <div class="detail-value">${userEmail}</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-label en-lang">${enText.ownerPhone}</div>
                <div class="detail-label th-lang">${thText.ownerPhone}</div>
                <div class="detail-value">${userTel}</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-label en-lang">${enText.ownerAddress}</div>
                <div class="detail-label th-lang">${thText.ownerAddress}</div>
                <div class="detail-value">${userAddress}</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-label en-lang">${enText.ownerZone}</div>
                <div class="detail-label th-lang">${thText.ownerZone}</div>
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