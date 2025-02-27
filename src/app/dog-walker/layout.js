"use client";

import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Noto_Sans_Thai } from "next/font/google";
import DogWalkerNav from "@/components/nav-bar/nav-dog-walker";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({ children }) {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Fetch user role from sessionStorage only on client side
    const role = sessionStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansThai.variable} font-auto antialiased`}
      >
        <DogWalkerNav/>
        {children}
      </body>
    </html>
  );
}
