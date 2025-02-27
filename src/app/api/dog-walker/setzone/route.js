import { SetZoneController } from '@/controllers/SetZoneController';
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const setZoneController = new SetZoneController();
        const formData = await request.formData();
        
        const id = formData.get('id'); // dog walker's id
        const password = formData.get('password');
        const tel = formData.get('tel');
        const address = formData.get('address');
        const zone = formData.getAll('zone'); // get all selected zones

        if (!id || !tel || !address || zone.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Missing required data.' },
                { status: 400 }
            );
        }

        let dogWalkerData = {
            id,
            password,
            tel,
            address,
            zone
        };

        const result = await setZoneController.updateProfile(dogWalkerData);

        if (!result.success) {
            return NextResponse.json(result, { status: 500 });
        }

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error'
            },
            { status: 500 }
        );
    }
}