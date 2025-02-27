"use client";

import * as React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WorkDescription = ({ service, detail, price, status }) => {
  return (
    <Card className="max-w-full mx px-4">
      <CardHeader className="grid grid-cols-5 gap-4 items-center">
        <div>{service}</div>
        <div>{detail}</div>
        <div>{price} บาท</div>
        <div>{status}</div>
        <Button variant="secondary">
          แก้ไข
        </Button>
        </CardHeader>
    </Card>
  );
};

export default WorkDescription;
