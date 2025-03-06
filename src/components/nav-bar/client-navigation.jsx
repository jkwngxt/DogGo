'use client';

import { useState, useEffect } from "react";
import AdminNav from "./nav-admin";
import DogWalkerNav from "./nav-dog-walker";
import PetOwnerNav from "./nav-pet-owner";
import { useAuth } from "@/hooks/useAuth";

const ClientNavigation = () => {
  const [userRole, setUserRole] = useState(null);
  const [name, setName] = useState(null);
  const [image, setImage] = useState(null);
    
  // Function to refresh session data
  const refreshSessionData = () => {
    // Fetch user role from sessionStorage
    const role = sessionStorage.getItem("userRole");
    setUserRole(role);
    
    // Get name from sessionStorage
    const userName = localStorage.getItem("name");
    setName(userName);
    
    const id = localStorage.getItem("id");
    if (id) {
      const imgPath = `/api/images/dog-walkers/images/${id}.jpg`;
      setImage(imgPath);
    }
  };
    
  useEffect(() => {
    refreshSessionData();
    
    // Set up an event listener for storage changes
    const handleStorageChange = () => {
      refreshSessionData();
    };
    
    // Create a custom event for auth state change
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChange', handleStorageChange);
    
    // Check frequently for changes
    const interval = setInterval(refreshSessionData, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChange', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (!userRole) return null;
  
  if (userRole === "admin") return <AdminNav />;
  if (userRole === "customer") return <PetOwnerNav userName={name} />;
  if (userRole === "dogWalker") return <DogWalkerNav userName={name} userImage={image} />;
  
  return null;
};

export default ClientNavigation;