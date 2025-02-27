"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleMinus} from '@fortawesome/free-solid-svg-icons';

const SignUpPage = () => {
  const [inputRows, setInputRows] = useState([{ id: 1 }]);

  const addInputRow = () => {
    setInputRows([...inputRows, { id: Date.now() }]); // Unique ID for each row
  };

  const deleteInputRow = (id) => {
    setInputRows(inputRows.filter(row => row.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#FFF8D6]">
      <Label className="text-center text-xl font-bold mb-2 mt-3">
        Sign Up - ข้อมูลสุนัข
      </Label>
      <Card className="w-9/12 h-auto bg-white p-6 shadow-lg">
        <CardContent>
          <div className="flex flex-col gap-4">
            {inputRows.map((row) => (
              <InputRow key={row.id} id={row.id} deleteRow={deleteInputRow} />
            ))}
            <div>
              <Button variant="secondary" className="ml-10" onClick={addInputRow}>
                + เพิ่มสุนัข
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center items-end space-x-4">
          <Button variant="default">สร้างบัญชี</Button>
          <Button variant="destructive">ยกเลิก</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const InputRow = ({ id, deleteRow }) => {
  return (
    <div className="flex flex-row mx-10 gap-10 justify-center">
      <div className="flex flex-col w-full">
        <Label htmlFor={`dogname-${id}`}>ชื่อสุนัข</Label>
        <Input id={`dogname-${id}`} type="text" placeholder="ชื่อสุนัข" className="rounded-xl mt-1" />
      </div>
      <div className="flex flex-col w-full">
        <Label htmlFor={`breed-${id}`}>สายพันธุ์</Label>
        <Input id={`breed-${id}`} type="text" placeholder="สายพันธุ์" className="rounded-xl mt-1" />
      </div>
      <div className="mt-6">
        <FontAwesomeIcon icon={faCircleMinus} onClick={() => deleteRow(id)} className="h-6 w-6 text-red-500"/>
      </div>
    </div>
  );
};

export default SignUpPage;
