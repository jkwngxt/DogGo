import { NextResponse } from 'next/server';
import { verifyTokenDirect } from './utils/jwt';

// กำหนดเส้นทางที่ต้องการอนุญาตให้เข้าถึงโดยไม่ต้องมี token
const publicRoutes = [
    '/',
    '/register',
    '/login',  // ควรเพิ่ม login เป็นเส้นทางสาธารณะด้วย
    '/api/auth', // ควรเพิ่ม API ที่เกี่ยวกับ auth ด้วย
    '/_next',   // Next.js static files
    '/favicon.ico',
];

// กำหนดกฎการเข้าถึงตามบทบาท
const roleBasedAccess = {
    '/admin-example': ['admin', 'user'],
};

export async function middleware(request) {
    console.log("Middleware executing for path:", request.nextUrl.pathname);

    const { pathname } = request.nextUrl;

    // อนุญาตให้เข้าถึงเส้นทางสาธารณะได้
    if (isPublicRoute(pathname)) {
        console.log("Public route detected, allowing access");
        return NextResponse.next();
    }

    // ดึง token จาก cookie
    const token = request.cookies.get('token')?.value;

    // ถ้าไม่มี token ให้ redirect ไปยังหน้า login
    if (!token) {
        console.log("No token found, redirecting to login");
        // return redirectToLogin(request); จะกลับมาแก้หลังเสร็จ ตอนนี้ต้องเปิดไว้เพื่อเทส
        console.log("Allow for dev");
        return NextResponse.next();
    }

    // ตรวจสอบความถูกต้องของ token
    try {
        const user = await verifyTokenDirect(token);

        // ถ้า token ไม่ถูกต้อง ให้ redirect ไปยังหน้า login
        if (!user) {
            console.log("Invalid token, redirecting to login");
            return redirectToLogin(request);
        }

        console.log("User authenticated:", user.username, "Role:", user.role);

        // ตรวจสอบสิทธิ์การเข้าถึงตามบทบาท
        for (const [route, roles] of Object.entries(roleBasedAccess)) {
            if (pathname.startsWith(route) && !roles.includes(user.role)) {
                console.log(`Access denied: ${user.role} cannot access ${route}`);
                // ถ้าไม่มีสิทธิ์เข้าถึง ให้ redirect ไปยังหน้า 404
                return redirectTo404(request);
            }
        }

        // อนุญาตให้เข้าถึงเส้นทางได้
        console.log("Access granted");
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