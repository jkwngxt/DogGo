import { NextResponse } from "next/server";
import { LoginController } from "@/controllers/LoginController";

const loginController = new LoginController();

export async function POST(request) {
    try {
        const body = await request.json();
        const response = await loginController.login(body);

        return NextResponse.json(response.body, { status: response.status });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
}