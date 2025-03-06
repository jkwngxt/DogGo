"use client";

import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Noto_Sans_Thai } from "next/font/google";

import "../globals.css";
import PetOwnerNav from "@/components/nav-bar/nav-pet-owner";

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
  const [name, setName] = useState(null)

  useEffect(() => {
    const name = localStorage.getItem("name");
    setName(name);
  }, []);

  return (
    <>
      <PetOwnerNav
        userName={name} />
      {children}
    </>
  );
}

