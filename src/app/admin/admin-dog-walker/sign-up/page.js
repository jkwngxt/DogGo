'use client';

import React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-[#FFF8D6] flex flex-col items-center">

      {/* Sign-Up Form */}
      <div className="mt-10 w-9/12 max-w-screen-md">
        <h2 className="text-3xl font-bold text-center">สร้างบัญชี Dog Walker</h2>
        <Card className="mt-6 bg-white pt-6 shadow-lg rounded-lg">
          <CardContent className="flex flex-col items-center">
            {/* Profile Image */}
            <div className="relative w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                <FontAwesomeIcon icon={faPen} className="absolute bottom-0 -right-2"/>
            </div>
            {/* Input Fields */}
            <div className="w-full mt-6">
              <Label className="font-semibold">Username</Label>
              <Input type="text" placeholder="username" className="rounded-xl" />
            </div>
            <div className="w-full mt-4">
              <Label className="font-semibold">ชื่อ - สกุล</Label>
              <Input type="text" placeholder="ชื่อ - สกุล" className="rounded-xl" />
            </div>
            <div className="w-full mt-4">
              <Label className="font-semibold">Email</Label>
              <Input type="email" placeholder="email" className="rounded-xl" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4 mt-16">
            <Button variant="default">สร้างบัญชี</Button>
            <Button variant="destructive">ยกเลิก</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
