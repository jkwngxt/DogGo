import React from "react";
import PetOwnerNav from "@/components/nav-bar/nav-pet-owner";

const PetOwnerLayout = ({ children }) => {
  return (
    <div>
      <PetOwnerNav
        userImage="/image/user-placeholder.jpg"
        userName="Pet Owner"
      />
      <main>{children}</main>
    </div>
  );
};

export default PetOwnerLayout;
