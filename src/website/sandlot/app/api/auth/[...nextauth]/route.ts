// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

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
          const user = await {
            id: "id",
            name: "temp_name",
            email: "email.com",
            role: "role",
            teamName: "teamName",
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
    async session({ session, user }: { session: Session; user: User }) {
      if (user) {
        session.user = {
          ...session.user,
          name: user.name,
          role: user.role,
          teamName: user.teamName,
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