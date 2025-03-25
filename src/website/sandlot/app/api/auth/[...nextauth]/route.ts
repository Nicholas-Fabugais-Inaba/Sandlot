// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

import getPlayer from "@/app/functions/getPlayer";
import getTeam from "@/app/functions/getTeam";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign-in form (e.g. 'Sign in with...')
      name: "Credentials",
      credentials: {
        userID: { label: "User ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (credentials) {
          // Fetch user data from your database
          let user = null;
          // TODO: if statments here are poor, should have better way of checking for email/password or player/team
          const regex = /[@]/;

          if (regex.test(credentials.userID)) {
            const player = await getPlayer({ email: credentials.userID });

            if (credentials.password == player.password) {
              let role;

              if (player.is_commissioner == true) {
                role = "commissioner";
              } else {
                role = "player";
              }
              user = {
                id: player.id,
                firstname: player.first_name,
                lastname: player.last_name,
                email: player.email,
                role: role,
                gender: player.gender,
                teamName: "team_name",
                username: "temp_username",
                division: "temp_division",
                offday: "temp_offday",
                preferred_division: "temp_preferred_division",
                preferred_time: "temp_preferred_time",
                team_id: player.team_id,
              };
            }
          } else if (credentials.userID != "admin") {
            const team = await getTeam({ username: credentials.userID });

            if (credentials.password == team.password) {
              user = {
                id: team.id,
                firstname: "temp_firstname",
                lastname: "temp_lastname",
                email: "temp_email",
                role: "team",
                gender: "temp_gender",
                teamName: team.team_name,
                username: team.username,
                division: team.division,
                offday: team.offday,
                preferred_division: team.preferred_division,
                preferred_time: team.preferred_time,
                team_id: team.id,
              };
            }
          }

          if (user) {
            return user;
          }
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt", // Ensure JWT is used for session handling
  },
  pages: {
    signIn: "/account/signin",
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user = {
          ...session.user,
          id: typeof token.id === "number" ? token.id : 0,
          firstname: typeof token.firstname === "string" ? token.firstname : "",
          lastname: typeof token.lastname === "string" ? token.lastname : "",
          email: typeof token.email === "string" ? token.email : "",
          role: typeof token.role === "string" ? token.role : "",
          gender: typeof token.role === "string" ? token.role : "",
          teamName: typeof token.teamName === "string" ? token.teamName : "",
          username: typeof token.username === "string" ? token.username : "",
          division: typeof token.division === "string" ? token.division : "",
          offday: typeof token.offday === "string" ? token.offday : "",
          preferred_division:
            typeof token.preferred_division === "string"
              ? token.preferred_division
              : "",
          preferred_time:
            typeof token.preferred_time === "string"
              ? token.preferred_time
              : "",
          team_id: typeof token.team_id === "number" ? token.team_id : 0,
        };
      }
      console.log("Session callback session:", session); // Debugging log

      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.firstname = user.name;
        token.lastname = user.name;
        token.email = user.email;
        token.role = user.role;
        token.gender = user.gender;
        token.teamName = user.teamName;
        token.username = user.username;
        token.division = user.division;
        token.offday = user.offday;
        token.preferred_division = user.preferred_division;
        token.preferred_time = user.preferred_time;
        token.team_id = user.team_id;
      }

      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure you have this set in your .env file
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
