import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import DogWalkerAdminCard from "@/components/ui/dog-walker-admin-card";
import PetOwnerNav from "@/components/ui/nav-pet-owner";
import DogWalkerNav from "@/components/ui/nav-dog-walker";
import WorkDescription from "@/components/ui/work-description";
import ServiceProviderNav from "@/components/ui/nav-service-provider";
import AdminNav from "@/components/ui/nav-admin";
import HomeDogWalker from "@/components/ui/home-dog-walker";

export default function Home() {
  return (
    <div>
      <div className="flex flex-row">
        <Link href="/pet-owner">Pet Owner</Link>
        <Button>Dog Walker</Button>
        <Button>Admin</Button>
        <Button>Service</Button>
      </div>
      <div className="flex flex-row">
        <Button>Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="destructive">Destructive Button</Button>
        <Button variant="outline">Outline Button</Button>
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">อีเมล Email</Label>
        <Input type="email" id="email" placeholder="Email" />
      </div>

      <Card className="w-[380px)]">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <DogWalkerAdminCard
        userImage="/image/user-placeholder.jpg"
        userName="John Doe"
        location="New York, NY"
        phoneNumber="(555) 123-4567"
        reviewScore="4.8"
      />

      <PetOwnerNav
        userImage="/image/user-placeholder.jpg"
        userName="Pet Owner"
      />

      <DogWalkerNav
        userImage="/image/user-placeholder.jpg"
        userName="Dog Walker"
      />

      <ServiceProviderNav
        userImage="/image/user-placeholder.jpg"
        userName="Service Provider"
      />

      <AdminNav userImage="/image/user-placeholder.jpg" userName="Admin" />

      <WorkDescription
        userName="John Doe"
        phoneNumber="(555) 123-4567"
        startTime="10:00"
        endTime="12:00"
        status={1}
      />

      <WorkDescription
        userName="John Doe"
        phoneNumber="(555) 123-4567"
        startTime="10:00"
        endTime="12:00"
        status={0}
      />

      <HomeDogWalker
        userImage="/image/user-placeholder.jpg"
        userName="John Doe"
        location="New York, NY"
        phoneNumber="(555) 123-4567"
        reviewScore="4.8"
      />
    </div>
  );
}
