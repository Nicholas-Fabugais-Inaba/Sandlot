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
      name: 'Credentials',
      credentials: {
        userID: { label: 'User ID', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (credentials) {
          // Fetch user data from your database
          let user = {
            id: "temp_id",
            name: "temp_name",
            email: "temp_email",
            role: "temp_role",
            gender: "temp_gender",
            teamName: "temp_team_name",
            username: "temp_username",
            division: "temp_division",
            offday: "temp_offday",
            preferred_division: "temp_preferred_division",
            preferred_time: "temp_preferred_time",
            team_id: 0,
          }
          // TODO: if statments here are poor, should have better way of checking for email/password or player/team
          const regex = /[@]/;
          if (regex.test(credentials.userID)) {
            const player = await getPlayer({ email: credentials.userID })
            let role
            if(player.is_commissioner == true) {
              role = "commissioner"
            }
            else {
              role = "player"
            }
            user = {
              id: player.id,
              name: player.first_name,
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
            }
          }
          else if(credentials.userID != "admin") {
            const team = await getTeam({ username: credentials.userID })
            user = {
              id: team.id,
              name: "temp_name",
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
            }
          }
          
          if (user) {
            return user; // This returns user info to NextAuth session handler
          }
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Ensure JWT is used for session handling
  },
  pages: {
    signIn: '/profile/signin',
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user = {
          ...session.user,
          name: token.name ?? '',
          role: typeof token.role === 'string' ? token.role : '',
          teamName: typeof token.teamName === 'string' ? token.teamName : '',
          team_id: typeof token.team_id === 'number' ? token.team_id : 0,
        };
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.teamName = user.teamName;
        token.team_id = user.team_id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure you have this set in your .env file
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };