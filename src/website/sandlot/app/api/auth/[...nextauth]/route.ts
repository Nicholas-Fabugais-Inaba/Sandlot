// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions, DefaultSession, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { mockUsers } from '../../users/database';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    teamName?: string | null;
    accountType: "player" | "team";
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}

interface CustomSession extends Session {
  user?: CustomUser;
}

interface CustomUser {
  id: string;
  email: string;
  name?: string | null;
  teamName?: string | null;
  accountType: "player" | "team";
}

async function authenticateUser(email: string, password: string) {
  const user = mockUsers.find((user) => user.email === email);

  if (user) {
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      console.log('Authenticated user:', user);  // Debugging log
      return {
        id: user.id,
        email: user.email,
        name: user.name || null,
        teamName: user.teamName || null,
        accountType: user.accountType,
      };
    }
  }

  return null;
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (credentials) {
          const user = await authenticateUser(credentials.email, credentials.password);
          if (user) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/profile/signin',
  },
  callbacks: {
    async session({ session, token }: { session: CustomSession, token: any }) {
      console.log("Session callback token:", token);
      if (token) {
        session.user = {
          ...session.user,
          id: token.id || "",
          email: token.email || "",
          name: token.name || null,
          teamName: token.teamName || null,
          accountType: token.accountType as "player" | "team",
        };
      }
      console.log("Session callback session:", session);  // Debugging log
      return session;
    },
    async jwt({ token, user }: { token: any, user?: CustomUser }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name || null;
        token.teamName = user.teamName || null;
        token.accountType = user.accountType;
      }
      console.log("JWT callback token:", token);  // Debugging log
      return token;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
