import { DogWalkerRegisterController } from '@/controllers/DogWalkerRegisterController.js';
import { NextResponse } from "next/server";


export async function POST(request) {
    try {
        const dogWalkerController = new DogWalkerRegisterController();
        const formData = await request.formData();
        const name = formData.get('name');
        const imageFile = formData.get('pic');
        const email = formData.get('email');
        const username = formData.get('username');

        let dogWalkerData = {
            name: name,
            username: username,
            email: email,
        }


        const result = await dogWalkerController.register(dogWalkerData, imageFile);


        if (!result.success) {
            if (result.message.includes('already exists')) {
                return NextResponse.json(result, {status: 409});
            }
            return NextResponse.json(result, {status: 500});
        }

        return NextResponse.json(result, {status: 201});

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error'
            },
            {status: 500}
        );
    }
}