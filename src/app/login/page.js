import Image from "next/image";
import logoSVG from "/public/image/logo.svg"; 
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative flex flex-col items-center p-8 bg-[#2668E3] rounded-2xl shadow-lg w-80">
          {/* Dog Image and Title */}
          <div className="absolute -top-24 ml-14 flex flex-col items-center">
            <Image src={logoSVG} alt="Logo" width={250} height={250} />
          </div>
          
          {/* Login Form */}
          <Label className="text-5xl font-semibold text-white mb-9 mt-4">Login</Label>     
          <input
            type="username"
            placeholder="Username"
            className="w-full p-2 mt-4 border rounded-md shadow-md shadow-[#0f4099] placeholder:text-black"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mt-5 border rounded-md shadow-md shadow-[#0f4099] placeholder:text-black"
          />
          <button className="w-full p-2 mt-5 text-white bg-[#FFC74A] rounded-md font-semibold hover:bg-yellow-500 shadow-md shadow-[#0f4099]">
            LOGIN
          </button>
          
          {/* Sign Up Link */}
          <p className="mt-6 mr-1 text-xs font-semibold text-black">
            Don’t have an account? <a href="#" className="font-semibold text-white">Sign Up</a>
          </p>
        </div>
      </div>
    );
  }