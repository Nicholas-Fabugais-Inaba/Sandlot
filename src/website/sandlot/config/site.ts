export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Sandlot",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Schedule",
      href: "/schedule",
    },
    {
      label: "Standings",
      href: "/standings",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Accept RR",
      href: "/accept-reschedule-request",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/Nicholas-Fabugais-Inaba/Sandlot",
    docs: "https://github.com/Nicholas-Fabugais-Inaba/Sandlot?tab=readme-ov-file#sandlot",
  },
};
