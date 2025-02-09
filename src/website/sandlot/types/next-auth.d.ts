import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      role: string;
      gender: string;
      teamName: string;
    };
  }

  interface User {
    name: string;
    email: string;
    role: string;
    gender: string;
    teamName: string;
  }
}