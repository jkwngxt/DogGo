export function generateWelcomeEmail(email, username, password) {
    const translations = {
        en: {
                title: 'Welcome to DogGo!',
                accountCreated: 'Your account has been successfully created.',
                loginCredentials: 'Here are your login details:',
                username: 'Username:',
                email: 'Email:',
                password: 'Password:',
                changePassword: 'For security reasons, please change your password upon first login.',
                regards: 'Best regards,',
                team: 'The DogGo Team',
                loginButton: 'Log In Now',
                disclaimer: 'If you did not sign up for this account, please disregard this email.',
                switchLanguage: 'ภาษาไทย'
        },
        th: {
                title: 'ยินดีต้อนรับสู่ DogGo!',
                accountCreated: 'บัญชีของคุณถูกลงทะเบียนเรียบร้อยแล้ว',
                loginCredentials: 'นี่คือรายละเอียดสำหรับการเข้าสู่ระบบของคุณ:',
                username: 'ชื่อผู้ใช้:',
                email: 'อีเมล:',
                password: 'รหัสผ่าน:',
                changePassword: 'เพื่อความปลอดภัย กรุณาเปลี่ยนรหัสผ่านของคุณหลังจากเข้าสู่ระบบครั้งแรก',
                regards: 'ขอแสดงความนับถือ,',
                team: 'ทีม DogGo',
                loginButton: 'เข้าสู่ระบบตอนนี้',
                disclaimer: 'หากคุณไม่ได้สมัครบัญชีนี้ กรุณาเพิกเฉยต่ออีเมลฉบับนี้',
                switchLanguage: 'English'
            }
    }


    const enText = translations.en;
    const thText = translations.th;

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Request / คำขอจองบริการ</title>
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
            width: 120px;
            color: #4b5563;
        }
        .detail-value {
            flex: 1;
            color: #111827;
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
            background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
            color: white;
            padding: 12px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 25px;
            font-weight: 600;
            box-shadow: 0 4px 6px rgba(255, 152, 0, 0.2);
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
                <span class="en-lang">ภาษาไทย</span>
                <span class="th-lang">English</span>
            </a>
        </div>
        
        <div class="header">
            <div class="logo">🐕</div>
            <h1 class="en-lang">New Booking Request</h1>
            <h1 class="th-lang">คำขอจองบริการใหม่</h1>
        </div>
        
        <div class="status-banner">
            <span class="en-lang">⚠️ You have a new walking request to review</span>
            <span class="th-lang">⚠️ คุณมีคำขอเดินสุนัขใหม่ที่รอการตรวจสอบ</span>
        </div>
        
        <p class="greeting en-lang">Hello Dog Walker,</p>
        <p class="greeting th-lang">สวัสดี Dog Walker,</p>
        
        <p class="en-lang">You have received a new booking request from <strong>อนิสา สุขทิพย์</strong>! Booking details:</p>
        <p class="th-lang">คุณได้รับคำขอใหม่เพื่อจองบริการจาก <strong>อนิสา สุขทิพย์</strong>! รายละเอียดการจองดังนี้</p>
        
        <div class="details">
            <h2><span class="icon-space">📅</span><span class="en-lang">Service Information</span><span class="th-lang">ข้อมูลบริการ</span></h2>
            
            <div class="detail-row">
                <div class="detail-label en-lang">Date:</div>
                <div class="detail-label th-lang">วันที่:</div>
                <div class="detail-value">2025-02-25</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-label en-lang">Time:</div>
                <div class="detail-label th-lang">เวลา:</div>
                <div class="detail-value">10:00 - 12:00</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-label en-lang">Total Price:</div>
                <div class="detail-label th-lang">ราคารวม:</div>
                <div class="detail-value">500 THB</div>
            </div>
        </div>
        
        <div class="details">
            <h2><span class="icon-space">👤</span><span class="en-lang">Customer Information</span><span class="th-lang">ข้อมูลลูกค้า</span></h2>
            
            <div class="detail-row">
                <div class="detail-label en-lang">Name:</div>
                <div class="detail-label th-lang">ชื่อ:</div>
                <div class="detail-value">อนิสา สุขทิพย์</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-label en-lang">Email:</div>
                <div class="detail-label th-lang">อีเมล:</div>
                <div class="detail-value">anisa@gmail.com</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-label en-lang">Phone:</div>
                <div class="detail-label th-lang">เบอร์โทร:</div>
                <div class="detail-value">0858846943</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-label en-lang">Address:</div>
                <div class="detail-label th-lang">ที่อยู่:</div>
                <div class="detail-value">34 ถนนสุขุมวิท ลาดพร้าว</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-label en-lang">Zone:</div>
                <div class="detail-label th-lang">เขตที่อยู่:</div>
                <div class="detail-value">ลาดพร้าว</div>
            </div>
        </div>
        
        <div class="details">
            <h2><span class="icon-space">🚶🏻‍♂️</span><span class="en-lang">Dog Walker Information</span><span class="th-lang">ข้อมูลคนเดินสุนัข</span></h2>
            
            <div class="detail-row">
                <div class="detail-label en-lang">Name:</div>
                <div class="detail-label th-lang">ชื่อ:</div>
                <div class="detail-value">Ben Ten</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-label en-lang">Email:</div>
                <div class="detail-label th-lang">อีเมล:</div>
                <div class="detail-value">ben.ten@example.com</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-label en-lang">Phone:</div>
                <div class="detail-label th-lang">เบอร์โทร:</div>
                <div class="detail-value">0960301258</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-label en-lang">Service Zone:</div>
                <div class="detail-label th-lang">เขตที่ให้บริการ:</div>
                <div class="detail-value">A</div>
            </div>
        </div>
        
        <div class="details">
            <h2><span class="icon-space">🐶</span><span class="en-lang">Dog Information</span><span class="th-lang">ข้อมูลสุนัข</span></h2>
            
            <div class="detail-row">
                <div class="detail-label en-lang">Number of Dogs:</div>
                <div class="detail-label th-lang">จำนวนสุนัข:</div>
                <div class="detail-value">2</div>
            </div>
            
            <ul>
                <li>
                    <strong>เบลล่า</strong><br>
                    <span class="en-lang">Breed: Bulldog</span>
                    <span class="th-lang">สายพันธุ์: Bulldog</span>
                </li>
                <li>
                    <strong>มะลิ</strong><br>
                    <span class="en-lang">Breed: Beagle</span>
                    <span class="th-lang">สายพันธุ์: Beagle</span>
                </li>
            </ul>
        </div>
        
        <p class="en-lang">Please review the booking details and contact the customer if necessary.</p>
        <p class="th-lang">โปรดตรวจสอบรายละเอียดการจอง และติดต่อผู้ใช้หากจำเป็น</p>
        
        <p class="en-lang">Best regards,<br><strong>The DogGo Team</strong></p>
        <p class="th-lang">ขอแสดงความนับถือ,<br><strong>ทีม DogGo</strong></p>
        
        <div class="footer">
            <p class="en-lang">If you have any questions, feel free to reach out to us at <a href="mailto:support@doggo.com">support@doggo.com</a>.</p>
            <p class="th-lang">หากมีข้อสงสัย โปรดติดต่อเราที่ <a href="mailto:support@doggo.com">support@doggo.com</a>.</p>
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
</html>`
}