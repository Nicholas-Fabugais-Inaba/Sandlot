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
      label: "Rescheduler",
      href: "/manage-reschedule-request",
    },
    {
      label: "Season Setup",
      href: "/season-setup",
    },
  ],
  navMenuItems: [
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
  ],
  links: {
    github: "https://github.com/Nicholas-Fabugais-Inaba/Sandlot",
    docs: "https://github.com/Nicholas-Fabugais-Inaba/Sandlot?tab=readme-ov-file#sandlot",
  },
};
