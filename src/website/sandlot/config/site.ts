export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Sandlot",
  description: "A web-based service that enables league and schedule management from a convenient user interface",
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
      label: "Account",
      href: "/account",
    },
    {
      label: "Rescheduler",
      href: "/manage-reschedule-request",
    },
  ],
  manageLeagueOptions: [
    {
      label: "Season Setup",
      href: "/season-setup",
    },
    // {
    //   label: "Broadcast",
    //   href: "/broadcast",
    // },
    {
      label: "Waiver",
      href: "/waiver",
    },
    // {
    //   label: "Archive",
    //   href: "/archive",
    // },
  ],
  links: {
    github: "https://github.com/Nicholas-Fabugais-Inaba/Sandlot",
    docs: "https://github.com/Nicholas-Fabugais-Inaba/Sandlot?tab=readme-ov-file#sandlot",
  },
};
