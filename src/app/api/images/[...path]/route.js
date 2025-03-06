// app/api/images/[...path]/route.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
    try {
        // Ensure params is awaited before accessing the path property
        const { params } = context;
        const pathArray = Array.isArray(params.path) ? params.path : [params.path];
        const filePath = pathArray.join('/');

        // สร้างเส้นทางเต็มไปยังไฟล์
        // process.cwd() จะทำงานที่นี่เพราะเป็น server-side
        const fullPath = path.join(process.cwd(), 'data', filePath);

        // อ่านไฟล์
        const fileBuffer = await fs.readFile(fullPath);

        // กำหนด content type ตามประเภทไฟล์
        const ext = path.extname(filePath).toLowerCase();
        let contentType = 'application/octet-stream';

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

        // ส่งไฟล์กลับไป
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400',
            },
        });
    } catch (error) {

        // ถ้าไม่พบไฟล์
        if (error.code === 'ENOENT') {
            return new NextResponse('Image not found', { status: 404 });
        }

        // กรณีอื่นๆ
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}