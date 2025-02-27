"use client";

import * as React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WorkDescription = ({ service, detail, price, status }) => {
  return (
    <Card className="max-w-full px-4">
      <CardHeader className="grid grid-cols-5 gap-4 justify-center items-center w-[50rem]">
        <div className="font-semibold pt-1">{service}</div>
        <div>{detail}</div>
        <div>{price}</div>
        <div>{status}</div>
        <Button variant="secondary" className="w-20">
          แก้ไข
        </Button>
        </CardHeader>
    </Card>
  );
};

export default WorkDescription;
