import * as React from "react"
import HomeDogWalker from '@/components/ui/home-dog-walker'
import DateTimeRangePicker from "@/components/ui/select-datetime";


export default function page() {
    const dogWalkers = [
        {
          userImage: "/images/user-placeholder.jpg",
          userName: "John Doe",
          location: "New York, NY",
          phoneNumber: "(555) 123-4567",
          reviewScore: "4.8",
        },
        {
          userImage: "/images/user-placeholder.jpg",
          userName: "Jane Smith",
          location: "Los Angeles, CA",
          phoneNumber: "(555) 987-6543",
          reviewScore: "4.9",
        },
        {
          userImage: "/images/user-placeholder.jpg",
          userName: "Jake Wilson",
          location: "Chicago, IL",
          phoneNumber: "(555) 111-2222",
          reviewScore: "4.7",
        },
 
      ];
  return (
    <div className="px-10 space-y-4"> 
    <div className="flex flex-col px-10">
        <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">โปรดเลือกวันที่และเวลา</h1>
        <DateTimeRangePicker/>
    </div>
     <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">รายการ Dog Walker</h1>
     {dogWalkers.map((walker, index) => (
          <HomeDogWalker
            key={index}
            userImage={walker.userImage}
            userName={walker.userName}
            location={walker.location}
            phoneNumber={walker.phoneNumber}
            reviewScore={walker.reviewScore}
          />
        ))}
    </div>
  )
}
