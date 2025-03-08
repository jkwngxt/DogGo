// app/api/images/[...path]/route.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
    try {
        // Ensure params is awaited before accessing the path property
        const pathArray = await params.path;
        const filePath = pathArray.join('/');

        console.log("filePath " + filePath);

        // สร้างเส้นทางเต็มไปยังไฟล์
        // process.cwd() จะทำงานที่นี่เพราะเป็น server-side
        const fullPath = path.join(process.cwd(), 'data', filePath);

        let fileBuffer;
        let contentType;

        try {
            // พยายามอ่านไฟล์ที่ร้องขอ
            fileBuffer = await fs.readFile(fullPath);

            // กำหนด content type ตามประเภทไฟล์
            const ext = path.extname(filePath).toLowerCase();
            contentType = 'application/octet-stream';

            switch (ext) {
                case '.jpg':
                case '.jpeg':
                    contentType = 'image/jpeg';
                    break;
                case '.png':
                    contentType = 'image/png';
                    break;
                case '.gif':
                    contentType = 'image/gif';
                    break;
                case '.svg':
                    contentType = 'image/svg+xml';
                    break;
            }

        } catch (error) {
            // ถ้าไม่พบไฟล์ ใช้ภาพ placeholder แทน
            if (error.code === 'ENOENT') {
                console.log('Image not found, using placeholder instead');
                const placeholderPath = path.join(process.cwd(), 'public', 'image', 'user-placeholder.jpg');
                fileBuffer = await fs.readFile(placeholderPath);
                contentType = 'image/jpeg';
            } else {
                // กรณีเกิดข้อผิดพลาดอื่นๆ
                throw error;
            }
        }

        // ส่งไฟล์กลับไป
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400',
            },
        });
    } catch (error) {
        console.error('Image loading error:', error);

        // กรณีเกิดข้อผิดพลาดอื่นๆ
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}