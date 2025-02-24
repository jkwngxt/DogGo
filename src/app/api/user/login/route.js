import { AuthController } from "@/controllers/authController";

const authcontroller = new AuthController();

export async function POST(request) {
    try {
        const body = await request.json();
        const response = await authcontroller.login(body);

        return new Response(JSON.stringify(response.body), {
            status: response.status,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Login error:", error);
        return new Response(JSON.stringify( { message: "Internal server error." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}