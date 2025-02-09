import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      role: string;
      gender: string;
      teamName: string;
      username: string;
      division: string;
      offday: string;
      preferred_division: string;
      preferred_time: string;
      team_id: number;
    };
  }

  interface User {
    name: string;
    email: string;
    role: string;
    gender: string;
    teamName: string;
    username: string;
    division: string;
    offday: string;
    preferred_division: string;
    preferred_time: string;
    team_id: number;
  }
}