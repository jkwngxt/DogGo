import { NextResponse } from 'next/server';
import { verifyTokenDirect } from './utils/jwt';

// กำหนดเส้นทางที่ต้องการอนุญาตให้เข้าถึงโดยไม่ต้องมี token
const publicRoutes = [
    '/',
    '/register',
    '/login',  // ควรเพิ่ม login เป็นเส้นทางสาธารณะด้วย
    '/api/user/login', //  API ที่เกี่ยวกับ login ด้วย
    '/api/user/register',
    '/_next',   // Next.js static files
    '/favicon.ico',
];

// กำหนดเส้นทางที่ผู้ใช้ที่ล็อกอินแล้วไม่ควรเข้าถึง (จะถูกพาไปหน้า role/homepage แทน)
const redirectIfLoggedIn = [
    '/',
    '/login',
    '/register',
];

// กำหนดกฎการเข้าถึงตามบทบาท
const roleBasedAccess = {
    '/admin/*': ['admin'],
    '/pet-owner/*': ['customer'],
    '/dog-walker/*': ['dogWalker'],
};

// กำหนดหน้า homepage ตามบทบาท
const roleHomepages = {
    'admin': '/admin/walker-register',
    'customer': '/pet-owner/homepage',
    'dogWalker': '/dog-walker/workpage',
    // กำหนด default สำหรับบทบาทที่ไม่ได้ระบุ
    'default': '/'
};

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // ดึง token จาก cookie
    const token = request.cookies.get('token')?.value;

    // กรณีมี token (ผู้ใช้ล็อกอินแล้ว) และพยายามเข้าถึงหน้า login หรือ root
    if (token && redirectIfLoggedIn.includes(pathname)) {
        try {
            const user = await verifyTokenDirect(token);
            if (user) {
                // รับหน้า homepage ตามบทบาทหรือใช้ค่า default ถ้าไม่มีการกำหนดไว้
                const homepagePath = roleHomepages[user.role] || roleHomepages.default;
                const redirectUrl = new URL(homepagePath, request.url);
                return NextResponse.redirect(redirectUrl);
            }
        } catch (error) {
            console.error("Error verifying token for redirection:", error);
            // กรณีมีข้อผิดพลาดในการตรวจสอบ token ให้ดำเนินการต่อไปตามปกติ
        }
    }

    // อนุญาตให้เข้าถึงเส้นทางสาธารณะได้
    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    // ถ้าไม่มี token ให้ redirect ไปยังหน้า login
    if (!token) {
        return redirectToLogin(request);
    }

    // ตรวจสอบความถูกต้องของ token
    try {
        const user = await verifyTokenDirect(token);

        // ถ้า token ไม่ถูกต้อง ให้ redirect ไปยังหน้า login
        if (!user) {
            return redirectToLogin(request);
        }

        // ตรวจสอบสิทธิ์การเข้าถึงตามบทบาท
        for (const [route, roles] of Object.entries(roleBasedAccess)) {
            if (pathname.startsWith(route) && !roles.includes(user.role)) {
                // ถ้าไม่มีสิทธิ์เข้าถึง ให้ redirect ไปยังหน้า 404
                return redirectTo404(request);
            }
        }

        // อนุญาตให้เข้าถึงเส้นทางได้
        return NextResponse.next();
    } catch (error) {
        console.error("Error verifying token:", error);
        return redirectToLogin(request);
    }
}

// ตรวจสอบว่าเป็นเส้นทางสาธารณะหรือไม่
function isPublicRoute(pathname) {
    return publicRoutes.some(route => {
        // ตรวจสอบว่า pathname เริ่มต้นด้วย route หรือเท่ากับ route
        return pathname === route || pathname.startsWith(`${route}/`);
    });
}

// Redirect ไปยังหน้า login
function redirectToLogin(request) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
}

// Redirect ไปยังหน้า 404
function redirectTo404(request) {
    return new NextResponse(null, { status: 404 });
}

// กำหนดให้ middleware ทำงานกับเส้นทางที่ไม่ได้อยู่ในรายการยกเว้น
export const config = {
    matcher: [
        // ตรวจสอบทุกเส้นทาง ยกเว้นที่ระบุใน matcher
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};