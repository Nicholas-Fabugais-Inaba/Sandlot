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
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo, BellIcon } from "@/components/icons";
import { NotificationModal } from "@/components/NotificationModal"; // Import modal
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/dropdown-menu";
import { ChevronDown } from "lucide-react";

import getRR from "../app/functions/getRR";
import getPlayerActiveTeam from "../app/functions/getPlayerActiveTeam";
import updatePlayerActiveTeam from "../app/functions/updatePlayerActiveTeam";

export const Navbar = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTeamId, setActiveTeamId] = useState<number>(0);
  const bellRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname(); // Get current URL path
  const [manageLeagueDropOpen, setManageLeagueDropOpen] = useState(false);

  useEffect(() => {
    const fetchSessionAndNotifications = async () => {
      try {
        const session = await getSession();
        setSession(session)
        console.log("Session:", session);
        console.log("Teams dict:", session?.user.teams);

        if (session && session.user.role === "player") {
          const activeTeamData = await getPlayerActiveTeam(session.user.id);
          setActiveTeamId(activeTeamData.team_id);

          if (!activeTeamId || activeTeamId <= 0) {
            updatePlayerActiveTeam({player_id: session.user.id, team_id: session.user.team_id});
          }
        }

        // Fetch unread notifications immediately
        if (session?.user.team_id) {
          const rrList = await getRR({ team_id: session.user.team_id });
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
    if (item.label === "Rescheduler" && session?.user.role !== "team") {
      return false; // Hide if the user is not part of a team
    } else if (
      item.label === "Team" &&
      session?.user.role !== "player" &&
      session?.user.role !== "team"
    ) {
      return false; // Hide if the user is not signed in as a team or player
    } else if (item.label === "Broadcast" && session?.user.role !== "commissioner") {
      return false; // Hide if the user is not a commissioner
    }

    return true;
  });

  const handleTeamSwitch = async (teamId: number) => {
    if (session) {
      await updatePlayerActiveTeam({player_id: session.user.id, team_id: teamId})
      setActiveTeamId(teamId)
      console.log(`Switched to team: ${session.user.teams[teamId]}`);
      // Refresh the page
      window.location.reload();
    }
  };

  const handleBellClick = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleManageLeagueOptionClick = (href: string) => {
    setManageLeagueDropOpen(false); // Hide the dropdown
    window.location.href = href; // Navigate to the selected page
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
            {session?.user.role === "commissioner" && (
              <NavbarItem className="relative group">
                <span className="cursor-default flex items-center gap-2">
                  Manage League
                  <ChevronDown size={16} />
                </span>
                <div className="absolute left-0 mt-0 hidden group-hover:flex bg-white dark:bg-gray-800 shadow-md rounded-lg p-2 z-10 w-42">
                  <ul className="w-full">
                    {siteConfig.manageLeagueOptions.map((option) => (
                      <li
                        key={option.href}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer text-center w-full"
                      >
                        <NextLink href={option.href} className="block w-full">
                          {option.label}
                        </NextLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </NavbarItem>
            )}
          </ul>        
        )}
      </NavbarContent>

      <NavbarContent
        className="flex basis-1/5 sm:basis-full gap-2"
        justify="end"
      >
        {session?.user.role === "player" && (
          <NavbarItem className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg cursor-pointer">
                {activeTeamId && session?.user.teams[activeTeamId]} <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-2">
                {session && Object.entries(session?.user.teams).map(([id, name]) => (
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
        {(session?.user.role === "team" || session?.user.role === "player") && (
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
        {siteConfig.navItems.map((item, index) => (
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
        team_id={activeTeamId} // Adjust this value
        setUnreadCount={setUnreadCount}
      />
    </HeroUINavbar>
  );
};