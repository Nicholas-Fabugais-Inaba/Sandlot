// components/navbar.tsx

"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo, BellIcon } from "@/components/icons";
import React, { useEffect, useState, useRef } from "react";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { NotificationModal } from "@/components/NotificationModal"; // Import modal

export const Navbar = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const userSession = await getSession();
      setSession(userSession);
      setLoading(false);
    };
    fetchSession();
  }, []);

  // Filter nav items based on user role
  const filteredNavItems = siteConfig.navItems.filter((item) => {
    if (item.label === "Season Setup" && session?.user.role !== "commissioner") {
      return false; // Hide for non-commissioners
    } else if (item.label === "Rescheduler" && session?.user.role !== "team") {
      return false; // Hide if the user is not part of a team
    } else if (item.label === "Team" && session?.user.role !== "player" && session?.user.role !== "team") {
      return false; // Hide if the user is not signed in as a team or player
    }
    return true;
  });

  const handleBellClick = () => {
    setIsModalOpen(prev => !prev);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <HeroUINavbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">Sandlot</p>
          </NextLink>
        </NavbarBrand>
        
        {/* Prevent rendering navbar items until session is loaded */}
        {!loading && (
          <ul className="hidden lg:flex gap-4 justify-start ml-2">
            {filteredNavItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>
        )}
      </NavbarContent>
  
      <NavbarContent className="flex basis-1/5 sm:basis-full gap-2" justify="end">
        <NavbarItem className="flex gap-2">
          <div ref={bellRef}> {/* Bell icon wrapper to track position */}
            <BellIcon
              onClick={handleBellClick}
              className="cursor-pointer"
            />
          </div>
        </NavbarItem>
        <NavbarItem className="flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarMenuToggle
          className="lg:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarMenu>
        {siteConfig.navMenuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link href={item.href} size="lg" onPress={() => setIsMenuOpen(false)}>
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

      {/* Modal */}
      <NotificationModal isOpen={isModalOpen} onClose={handleCloseModal} anchorRef={bellRef} />
    </HeroUINavbar>
  );
};
