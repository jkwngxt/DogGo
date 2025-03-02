"use client";

import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import Reviews from "@/components/review";
import React, { useEffect, useState } from "react";
import ClientDogSelector from "@/components/client-dog";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/loading";

export default function DogWalker({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dogWalkerData, setDogWalkerData] = useState(null);
  const [userDogs, setUserDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userZone, setUserZone] = useState(null);
  const [canBook, setCanBook] = useState(false);

  // Use React.use to unwrap the params Promise
  // ตัวอย่าง route http://localhost:3000/pet-owner/dog-walker/1?startTime=15&endTime=18&date=2025-02-24
  const unwrappedParams = React.use(params);
  const dwId = parseInt(unwrappedParams.dwId);

  const startTimeSearch = searchParams.get('startTime') ? parseInt(searchParams.get('startTime')) : 0;
  const endTimeSearch = searchParams.get('endTime') ? parseInt(searchParams.get('endTime')) : 0;
  const dateSearch = searchParams.get('date') || null;

  useEffect(() => {
    const fetchDogWalkerData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dog-walker/read-review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dwId,
            startTimeInt: startTimeSearch,
            endTimeInt: endTimeSearch,
            date: dateSearch,
          }),
        });

        if (!response.ok) {
          notFound();
        }

        const data = await response.json();
        if (data.success) {
          setDogWalkerData(data.dogWalkers);
          setUserDogs(data.dogs.map(dog => dog.name)); // Extract dog names for selector
          setUserZone(data.userZone);
          setCanBook(data.canBook);
        } else {
          throw new Error(data.message || 'Failed to fetch dog walker data');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching dog walker data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (dwId) {
      fetchDogWalkerData();
    }
  }, [dwId, startTimeSearch, endTimeSearch, dateSearch]);

  if (loading) {
    return (
        <Loading />
    );
  }

  if (error || !dogWalkerData) {
    notFound();
  }

  // Prepare and format the reviews
  const reviewData = dogWalkerData.reviews ? dogWalkerData.reviews.map((review, index) => ({
    r_id: index + 1,
    u_username: review.username || '',
    rating: review.rating,
    r_text: review.text || '',
    avatar: "/image/user-placeholder.jpg", // Default avatar for now
  })) : [];

  // ใช้ API Route เพื่อเรียกรูปภาพ - เส้นทางรูปภาพจะถูกกำหนดที่นี่
  const getImagePath = (picPath) => {
    if (!picPath) return "/image/user-placeholder.jpg";
    if (picPath.startsWith('http')) return picPath;

    // ตัด / ข้างหน้าออกถ้ามี
    const normalizedPath = picPath.startsWith('/') ? picPath.slice(1) : picPath;

    // ใช้ API Route
    return `/api/images/${normalizedPath}`;
  };

  const imgPath = getImagePath(dogWalkerData.pic);

  const handleBack = () => {
    try {
      // ใช้ window.history เพื่อตรวจสอบว่ามีหน้าก่อนหน้าหรือไม่
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/");
      }
    } catch (error) {
      // หากเกิดข้อผิดพลาดใดๆ ให้ใช้ window.location แทน
      window.location.href = "/";
    }
  };

  return (
      <>
        <div className="p-4 space-y-4">
          <div className="flex flex-col px-10 items-center">
            <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
              รายละเอียด Dog Walker
            </h1>

            <Card className="w-[100%] sm:w-[60%] md:w-[60%] lg:w-[80%] p-6">
              <div className="flex flex-col space-y-2 items-center">
                <img
                    src={imgPath}
                    alt={`${dogWalkerData.name} profile`}
                    className="w-48 h-48 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/image/user-placeholder.jpg";
                    }}
                />
                <div className="flex flex-row font-bold items-baseline">
                  <FontAwesomeIcon
                      icon={faStar}
                      className="h-5 w-5 text-yellow-400 mr-1"
                  />
                  {dogWalkerData.meanRating ? dogWalkerData.meanRating.toFixed(1) : "0.0"}
                  <div className="flex flex-row font-semibold text-sm ml-1">
                    ({dogWalkerData.ratingCount || 0} รีวิว)
                  </div>
                </div>
                <div className="flex justify-between w-6/12">
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <span className="font-bold">ชื่อพนักงาน:</span>
                      <span>{dogWalkerData.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="font-bold">เขตที่ดูแล:</span>
                      <span>{Array.isArray(dogWalkerData.zone)
                          ? dogWalkerData.zone.join(', ')
                          : dogWalkerData.zone}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <span className="font-bold">เบอร์โทรติดต่อ:</span>
                      <span>{dogWalkerData.tel}</span>
                    </div>
                  </div>
                </div>

                <Reviews reviewData={reviewData}/>
                <div className="flex flex-row space-x-4">
                  { canBook && (userZone && Array.isArray(dogWalkerData.zone) && dogWalkerData.zone.includes(userZone)) ? (
                      <ClientDogSelector
                          dogs={userDogs}
                          searchTime={{
                            startTimeSearch,
                            endTimeSearch,
                            dateSearch
                          }}
                          dogWalker={{
                            id: dwId,
                            name: dogWalkerData.name,
                            tel: dogWalkerData.tel
                          }}
                      />
                  ) : (
                      <div className="opacity-50 pointer-events-none">
                        <ClientDogSelector dogs={[]} />
                      </div>
                  )}
                  <Button variant="destructive"
                          onClick={handleBack}
                  >
                    ยกเลิก
                  </Button>
                </div>



                {!canBook ? (
                    <p className="text-blue-800 mt-1">ท่านไม่ได้ค้นหา dog walker อย่างถูกต้อง กรุณาทำรายการในหน้าค้นหาอีกครั้ง</p>
                ) : (
                    userZone && Array.isArray(dogWalkerData.zone) && !dogWalkerData.zone.includes(userZone) ? (
                        <p className="text-blue-800 mt-1">ท่านอยู่นอกเขตที่ dog walker ให้บริการ</p>
                    ) : null
                )}

              </div>
            </Card>
          </div>
        </div>
      </>
  );
}