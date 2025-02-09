// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import authenticateAccount from "@/app/functions/authenticateAccount";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign-in form (e.g. 'Sign in with...')
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (credentials) {
          // Fetch user data from your database
          const player = await authenticateAccount({ email: credentials.email })
          const user = {
            id: "temp_id",
            name: player.first_name,
            email: player.email,
            role: "player",
            teamName: "team_name",
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
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure you have this set in your .env file
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };