import React from "react";
import PetOwnerNav from "@/components/ui/nav-pet-owner";

const PetOwnerLayout = ({ children }) => {
  return (
    <div>
      <PetOwnerNav
        userImage="/images/user-placeholder.jpg"
        userName="Pet Owner"
      />
      <main>{children}</main>
    </div>
  );
};

export default PetOwnerLayout;
