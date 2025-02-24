import * as React from "react"
import { Card } from "@/components/ui/card";


export default function page() {
    const dogWalkers = [
        {
          userImage: "/image/user-placeholder.jpg",
          userName: "John Doe",
          location: "New York, NY",
          phoneNumber: "(555) 123-4567",
          reviewScore: "4.8",
        },
        {
          userImage: "/image/user-placeholder.jpg",
          userName: "Jane Smith",
          location: "Los Angeles, CA",
          phoneNumber: "(555) 987-6543",
          reviewScore: "4.9",
        },
        {
          userImage: "/image/user-placeholder.jpg",
          userName: "Jake Wilson",
          location: "Chicago, IL",
          phoneNumber: "(555) 111-2222",
          reviewScore: "4.7",
        },
 
      ];
  return (
    <div className="px-10 space-y-4"> 
    <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">รายการและสถานะบริการจูงสุนัข</h1>
    <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">คูปองของฉัน</h1>
 
    </div>
  )
}
