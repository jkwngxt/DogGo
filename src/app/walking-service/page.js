import * as React from "react"
import HomeDogWalker from '@/components/home-dog-walker'
import DateTimeRangePicker from "@/components/select-datetime";


export default function WalkingService() {
    const dogWalkers = [
        {
          userImage: "/image/user-placeholder.jpg",
          dw_username: "John Doe",
          dw_zone: "New York, NY",
          dw_tel: "(555) 123-4567",
          rating: "4.8",
        },
        {
          userImage: "/image/user-placeholder.jpg",
          dw_username: "Jane Smith",
          dw_zone: "Los Angeles, CA",
          dw_tel: "(555) 987-6543",
          rating: "4.9",
        },
        {
          userImage: "/image/user-placeholder.jpg",
          dw_username: "Jake Wilson",
          dw_zone: "Chicago, IL",
          dw_tel: "(555) 111-2222",
          rating: "4.7",
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
            dw_username={walker.dw_username}
            dw_zone={walker.dw_zone}
            dw_tel={walker.dw_tel}
            rating={walker.rating}
          />
        ))}
    </div>
  )
}
