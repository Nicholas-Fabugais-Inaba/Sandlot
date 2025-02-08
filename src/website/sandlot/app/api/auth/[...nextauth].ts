// app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { mockUsers } from '../users/database';  // Use shared array

async function authenticateUser(email: string, password: string) {
  const user = mockUsers.find((user) => user.email === email);

  if (user) {
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      return {
        id: user.id,
        email: user.email,
        name: user.name || null,
        teamName: user.teamName || null,
      };
    }
  }

  return null;
}

const authOptions = {
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
            return user; // This returns user info to NextAuth session handler
          }
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const, // Ensure JWT is used for session handling
  },
  pages: {
    signIn: '/profile/signin',
  },
  callbacks: {
    async session({ session, user }: { session: any, user: any }) {
      if (user) {
        session.user = {
          ...session.user,
          name: user.name || null,
          teamName: user.teamName || null,
        };
      }
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
