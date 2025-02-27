"use client";

import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Noto_Sans_Thai } from "next/font/google";
import { NavAdmin } from "@/components/ui/nav-admin";
import { NavDogWalker } from "@/components/ui/nav-dog-walker";
import { NavPetOwner } from "@/components/ui/nav-pet-owner";
import { NavServiceProvider } from "@/components/ui/nav-service-provider";

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

// Function to determine which navbar to display
// function getNavbar(role) {
//   switch (role) {
//     case "admin":
//       return <NavAdmin />;
//     case "dog_walker":
//       return <NavDogWalker />;
//     case "pet_owner":
//       return <NavPetOwner />;
//     case "service_provider":
//       return <NavServiceProvider />;
//     default:
//       return null; // No navbar if no role is set
//   }
// }

export default function RootLayout({ children }) {
  // const [userRole, setUserRole] = useState(null);

  // useEffect(() => {
  //   // Fetch user role from sessionStorage only on client side
  //   const role = sessionStorage.getItem("userRole");
  //   setUserRole(role);
  // }, []);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* {getNavbar(userRole)} */}
        {children}
      </body>
    </html>
  );
}
