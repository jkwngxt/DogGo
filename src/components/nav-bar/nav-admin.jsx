"use client";

import React from "react";
import {
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "@/hooks/useAuth";

const ListItem = React.forwardRef(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
              className || ""
            }`}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);

ListItem.displayName = "ListItem";

const AdminNav = () => {
  const { logout } = useAuth();
  return (
    <div className="flex px-10 bg-[#2668E3] justify-between">
      <img className="w-20 h-20" src="/image/logo.svg" alt="dog go logo" />
      <div className="flex flex-row space-x-4 items-center">
        <img
          src="/image/user-placeholder.jpg"
          alt="User profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="text-white font-bold">DogGo Admin</div>
        <button onClick={logout}>
            <FontAwesomeIcon icon={faSignOut} className="h-5 w-5 text-white"/>
        </button>
      </div>
    </div>
  );
};

export default AdminNav;
