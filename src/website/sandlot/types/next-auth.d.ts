import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      firstname: string;
      lastname: string;
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
      teams: Array;
    };
  }

  interface User {
    id: number;
    firstname: string;
    lastname: string;
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
    teams: Array;
  }
}
