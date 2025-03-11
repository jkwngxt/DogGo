"use client";

import React from "react";
import { useRouter } from "next/navigation"; 
import Image from "next/image";
import logoSVG from "/public/image/logo.svg"
import bgImage from "/public/image/first-page.jpg"
import Link from "next/link";

const FirstPage = () => {
    const router = useRouter();

    const handleLoginClick = async () => {
      router.push(`/login`);
    };

    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-cover bg-center">
        <Image 
          src={bgImage} 
          alt="Background" 
          layout="fill" 
          objectFit="cover"
          quality={100} 
          priority 
          className="-z-10"
        />
        {/* Main Container with Subtle Animation */}
        <div className="bg-white shadow-xl rounded-3xl px-8 py-10 w-11/12 sm:w-3/5 md:w-1/2 lg:w-2/5 flex flex-col items-center transform transition duration-500 hover:scale-105">
          {/* Logo with Paw Print Background */}
          <div className="relative mb-8">
            <div className="absolute -top-3 -left-3 w-32 h-32 bg-yellow-200 rounded-full opacity-50"></div>
            <Image 
              src={logoSVG} 
              alt="DogGo Logo" 
              width={160} 
              height={160}
              className="relative z-10 drop-shadow-md" 
            />
          </div>
          
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 mb-6">DogGo</h1>
          
          <p className="text-center text-gray-700 text-lg mb-10 leading-relaxed">
            <span className="font-semibold text-lg">แพลตฟอร์มค้นหาบริการพาสุนัขเดินเล่น เชื่อมต่อผู้ให้บริการมืออาชีพ จองคิว ติดตาม และดูแลสุนัขได้ง่าย มั่นใจทุกขั้นตอน</span>
          </p>
          
          {/* Login Button with Animation */}
          <button
            onClick={handleLoginClick}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xl font-bold py-3 px-8 rounded-xl transition-all duration-300 w-full text-center shadow-lg hover:shadow-blue-200 flex items-center justify-center gap-2"
          >
            <span>LOGIN</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Sign Up Link with Improved Styling */}
          <div className="mt-8 text-base font-medium text-gray-700 flex items-center">
            <span>Don't have an account?</span>
            <Link 
              href="/register" 
              className="font-bold text-blue-600 hover:text-blue-400 ml-2 relative group"
            >
              Sign Up
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-6 right-6 w-12 h-12 bg-blue-200 rounded-full opacity-40"></div>
          <div className="absolute bottom-6 left-6 w-16 h-16 bg-blue-200 rounded-full opacity-30"></div>
        </div>
        
        {/* Floating Paw Prints (Decorative) */}
        <div className="absolute top-1/4 right-1/4 text-blue-200 opacity-20 text-4xl transform rotate-12">
          🐾
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-blue-200 opacity-20 text-4xl transform -rotate-12">
          🐾
        </div>
      </div>
    );
};


export default FirstPage;
