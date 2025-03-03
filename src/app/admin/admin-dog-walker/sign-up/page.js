"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import ConfirmationDialogs from "@/components/confirmation-dialogs";

const SignUpPage = () => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
  
    if (file) {
      setSelectedFile(file); //  Store file in state
  
      // Create an image preview using FileReader
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validateUsername = (username) => {
    return username.startsWith("dw-");
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleConfirmClick = async () => {
    // Validate inputs before sending request
    if (!validateUsername(username)) {
      setMessage("Username ต้องขึ้นต้นด้วย 'dw-'");
      setShowErrorDialog(true);
      return;
    }
  
    if (!validateEmail(email)) {
      setMessage("โปรดป้อนอีเมลที่ถูกต้อง");
      setShowErrorDialog(true);
      return;
    }
  
    try {
      setIsLoading(true)
      // Prepare FormData
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("email", email);
      
      if (selectedFile) {
        formData.append("imageFile", selectedFile);
      } 
  
      // Send POST request to API
      const response = await fetch("/api/dog-walker/register", {
        method: "POST",
        body: formData,
      });
  
      // Check for 409 status (Conflict) specifically
      if (response.status === 409) {
        setMessage("ผู้ใช้หรืออีเมลถูกใช้งานแล้ว กรุณากรอกข้อมูลอีกครั้ง");
        setShowErrorDialog(true);
        return;
      }
  
      const data = await response.json();
      
      setIsLoading(false)

      if (data.success) {
        console.log(data)
        setMessage("บันทึกข้อมูลเข้าระบบเรียบร้อย");
        setShowSuccessDialog(true);
      } else {
        setMessage("โปรดตรวจสอบข้อมูลของท่านอีกครั้ง");
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("เกิดข้อผิดพลาดในการลงทะเบียน");
      setShowErrorDialog(true);
    }
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    setShowErrorDialog(false);
  };
  return (
    <>
      <div className="min-h-screen bg-[#FFF8D6] flex flex-col items-center">
        {/* Sign-Up Form */}
        <div className="mt-10 w-9/12 max-w-screen-md">
          <h2 className="text-3xl font-bold text-center">
            สร้างบัญชี Dog Walker
          </h2>
          <Card className="mt-6 bg-white pt-6 shadow-lg rounded-lg">
            <CardContent className="flex flex-col items-center">
              {/* Profile Image with Edit Button */}
              <div className="relative flex items-end">
                <div className="relative">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile Preview"
                      className="object-cover w-20 h-20 rounded-full"
                    />
                  ) : (
                    <img
                      src="/image/user-placeholder.jpg"
                      alt="Profile Preview"
                      className="object-cover w-20 h-20 rounded-full"
                    />
                  )}
                </div>

                {/* Pen Icon Button placed beside image */}
                <button
                  onClick={() => document.getElementById("fileInput").click()}
                  className="bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                </button>

                {/* Hidden File Input */}
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* Input Fields */}
              <div className="w-full mt-6">
                <Label className="font-semibold">Username</Label>
                <Input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="w-full mt-4">
                <Label className="font-semibold">ชื่อ - สกุล</Label>
                <Input
                  type="text"
                  placeholder="ชื่อ - สกุล"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="w-full mt-4">
                <Label className="font-semibold">Email</Label>
                <Input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-center space-x-4 mt-16">
              <Button 
              variant="default" 
              onClick={handleConfirmClick}
              disabled={isLoading}>
               {isLoading ? "กำลังสร้างบัญชี..." : "สร้างบัญชี"}
              </Button>
              <Button variant="destructive">ยกเลิก</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <ConfirmationDialogs
        showSuccessDialog={showSuccessDialog}
        showErrorDialog={showErrorDialog}
        message={message}
        onSuccessClose={handleDialogClose}
        onErrorClose={handleDialogClose}
      />
    </>
  );
};

export default SignUpPage;
