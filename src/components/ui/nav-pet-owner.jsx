"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';

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

const PetOwnerNav = ({ userImage, userName}) => {
  return (
    <div className="flex px-10 bg-[#2668E3] justify-between">
      <img className="w-20 h-20" src="/logo.svg" alt="dog go logo" />
      <div className="flex flex-row space-x-4 items-center">
        <img
          src={userImage}
          alt="User profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="text-white font-bold">{userName}</div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-2 md:w-[50px] lg:w-[150px] ]">
                  <ListItem href="/pet-owner" title="หน้าหลัก"/>
                  <ListItem href="/pet-owner/walking-service" title="บริการจูงสุนัข"/>
                  <ListItem
                    href="/pet-owner/other-service"
                    title="บริการอื่นๆ"
                  />
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <button>
            <FontAwesomeIcon icon={faSignOut} className="h-5 w-5 text-white"/>
        </button>
      </div>
    </div>
  );
};

export default PetOwnerNav;
