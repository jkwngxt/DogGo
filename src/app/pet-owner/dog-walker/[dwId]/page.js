"use client";

import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import Reviews from "@/components/review";
import React, { useEffect, useState } from "react";
import ClientDogSelector from "@/components/client-dog";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/loading";
import ConfirmationDialogs from "@/components/confirmation-dialogs";

export default function DogWalker({ params }) {
  // Always put hooks at the top level
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const dwId = parseInt(unwrappedParams.dwId);
  const searchParams = useSearchParams();

  const [dogWalkerData, setDogWalkerData] = useState(null);
  const [userDogs, setUserDogs] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userZone, setUserZone] = useState(null);
  const [canBook, setCanBook] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [message, setMessage] = useState("");

  // Get search parameters
  const startTimeSearch = searchParams.get('startTime') ? parseInt(searchParams.get('startTime')) : 0;
  const endTimeSearch = searchParams.get('endTime') ? parseInt(searchParams.get('endTime')) : 0;
  const rawDateSearch = searchParams.get('date') || null;

  // Validate search parameters
  const validateSearchParams = () => {
    const searchDataStr = sessionStorage.getItem('walkingServiceSearch');

    if (!searchDataStr) return false;

    try {
      const searchData = JSON.parse(searchDataStr);

      return (
          searchData.startTimeInt === startTimeSearch &&
          searchData.endTimeInt === endTimeSearch &&
          searchData.date === rawDateSearch
      );
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const fetchDogWalkerData = async () => {
      try {
        setIsLoading(true);

        // Validate search parameters
        if (!validateSearchParams()) {
          setMessage("ข้อมูลการค้นหาไม่ถูกต้อง กรุณาทำรายการใหม่");
          setShowErrorDialog(true);
          setCanBook(false);
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/dog-walker/read-review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dwId,
            startTimeInt: startTimeSearch,
            endTimeInt: endTimeSearch,
            date: rawDateSearch,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch dog walker data');
        }

        const data = await response.json();
        if (data.success) {
          setDogWalkerData(data.dogWalkers);
          setUserDogs(data.dogs);
          setUserZone(data.userZone);
          setCanBook(data.canBook);

          // Store dog walker data in sessionStorage
          sessionStorage.setItem('selectedDogWalker', JSON.stringify({
            id: data.dogWalkers.id,
            name: data.dogWalkers.name,
            tel: data.dogWalkers.tel || 'ไม่ระบุ'
          }));
        } else {
          throw new Error(data.message || 'Failed to fetch dog walker data');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching dog walker data:', err);
        setMessage(err.message || "ไม่สามารถดึงข้อมูล Dog Walker ได้");
        setShowErrorDialog(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (dwId) {
      fetchDogWalkerData();
    }
  }, [dwId, startTimeSearch, endTimeSearch, rawDateSearch]);

  const handleDialogClose = () => {
    setShowErrorDialog(false);
    router.push('/pet-owner/walking-service');
  };

  const handleBack = () => {
    try {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/pet-owner/walking-service");
      }
    } catch (error) {
      window.location.href = "/pet-owner/walking-service";
    }
  };

  // Helper function to get image path
  const getImagePath = (picPath) => {
    if (!picPath) return "/image/user-placeholder.jpg";
    if (picPath.startsWith('http')) return picPath;

    const normalizedPath = picPath.startsWith('/') ? picPath.slice(1) : picPath;
    return `/api/images/${normalizedPath}`;
  };

  // Handle loading state
  if (loading) {
    return <Loading />;
  }

  // Handle error state
  if (error || !dogWalkerData) {
    return (
        <ConfirmationDialogs
            showErrorDialog={true}
            message="มีบางอย่างผิดพลาด กรุณาทำรายการอีกครั้ง"
            onErrorClose={() => router.push('/pet-owner/walking-service')}
        />
    );
  }

  // Prepare and format the reviews
  const reviewData = dogWalkerData.reviews ? dogWalkerData.reviews.map((review, index) => ({
    r_id: index + 1,
    u_username: review.username || '',
    rating: review.rating,
    r_text: review.text || '',
    avatar: "/image/user-placeholder.jpg", // Default avatar for now
  })) : [];

  const imgPath = getImagePath(dogWalkerData.pic);

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
                      <span>{dogWalkerData.tel || 'ไม่ระบุ'}</span>
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
                            dateSearch: rawDateSearch // Pass original string for display purposes
                          }}
                          dogWalker={{
                            id: dwId,
                            name: dogWalkerData.name,
                            tel: dogWalkerData.tel || 'ไม่ระบุ'
                          }}
                      />
                  ) : (
                      <div className="opacity-50 pointer-events-none">
                        <Button disabled>เลือก</Button>
                      </div>
                  )}
                  <Button variant="destructive" onClick={handleBack}>
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

        <ConfirmationDialogs
            showErrorDialog={showErrorDialog}
            message={message}
            onErrorClose={handleDialogClose}
        />
      </>
  );
}