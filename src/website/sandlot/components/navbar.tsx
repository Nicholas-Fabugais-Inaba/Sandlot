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
import React, { useEffect, useState, useRef } from "react";
import { useSession, getSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo, BellIcon } from "@/components/icons";
import { NotificationModal } from "@/components/NotificationModal"; // Import modal
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/dropdown-menu";
import { ChevronDown } from "lucide-react";

import getRR from "../app/functions/getRR";
import { useGlobalState } from "../context/GlobalStateContext";

export const Navbar = () => {
  const { teamId, teamName, setTeamId, setTeamName } = useGlobalState();
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal
  const [unreadCount, setUnreadCount] = useState(0);
  const [userTeams, setUserTeams] = useState<{ [key: number]: string }>({});
  const [userRole, setUserRole] = useState<string>("");
  const bellRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname(); // Get current URL path

  useEffect(() => {
    const fetchSessionAndNotifications = async () => {
      try {
        const userSession = await getSession();
        console.log("Session:", userSession);
        console.log("Teams dict:", userSession?.user.teams);

        if (userSession) {
          setUserTeams(userSession.user.teams);
          if (!teamId) {
            setTeamId(userSession.user.team_id);
          }
          setUserRole(userSession.user.role);
          setTeamName(userSession.user.teamName);
        }

        // Fetch unread notifications immediately
        if (userSession?.user.team_id) {
          const rrList = await getRR({ team_id: userSession.user.team_id });
          const unreadNotifications = rrList.filter((rr: any) => !rr.isRead);
          setUnreadCount(unreadNotifications.length);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching session and notifications:", error);
        setLoading(false);
      }
    };

    fetchSessionAndNotifications();
  }, []);

  // Filter nav items based on user role
  const filteredNavItems = siteConfig.navItems.filter((item) => {
    if (item.label === "Season Setup" && userRole !== "commissioner") {
      return false; // Hide for non-commissioners
    } else if (item.label === "Rescheduler" && userRole !== "team") {
      return false; // Hide if the user is not part of a team
    } else if (
      item.label === "Team" &&
      userRole !== "player" &&
      userRole !== "team"
    ) {
      return false; // Hide if the user is not signed in as a team or player
    }

    return true;
  });

  const handleTeamSwitch = async (teamId: number) => {
    setTeamId(teamId);
    setTeamName(userTeams[teamId]);
    console.log(`Switched to team: ${userTeams[teamId]}`);
    window.location.reload(); // Refresh the page
  };

  const handleBellClick = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <HeroUINavbar
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
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
                    pathname === item.href
                      ? "text-primary font-semibold border-b-2 border-primary"
                      : "hover:text-gray-600"
                  )}
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>        
        )}
      </NavbarContent>

      <NavbarContent
        className="flex basis-1/5 sm:basis-full gap-2"
        justify="end"
      >
        {userRole === "player" && (
          <NavbarItem className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg cursor-pointer">
                {teamId && userTeams[teamId]} <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-2">
                {Object.entries(userTeams).map(([id, name]) => (
                  <DropdownMenuItem
                    key={id}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md"
                    onClick={() => handleTeamSwitch(Number(id))}
                  >
                    {name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </NavbarItem>
        )}
        {(userRole === "team" || userRole === "player") && (
          <NavbarItem className="flex gap-2">
            <div ref={bellRef}>
              {" "}
              {/* Bell icon wrapper to track position */}
              <BellIcon
                className="cursor-pointer"
                onClick={handleBellClick}
                unreadCount={unreadCount}
              />
            </div>
          </NavbarItem>
        )}
        <NavbarItem className="flex gap-2">
          <ThemeSwitch />
        </NavbarItem>

        {/* Menu toggle */}
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden"
        />
      </NavbarContent>

      <NavbarMenu>
        {siteConfig.navMenuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link
              href={item.href}
              size="lg"
              onPress={() => setIsMenuOpen(false)}
              className={clsx(
                pathname === item.href
                  ? "text-primary font-semibold border-b-2 border-primary"
                  : "hover:text-gray-600"
              )}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

      {/* Modal */}
      <NotificationModal
        anchorRef={bellRef}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        team_id={teamId} // Adjust this value
        setUnreadCount={setUnreadCount}
      />
    </HeroUINavbar>
  );
};