// app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { mockUsers } from '../../users/database';  // Use shared array

async function authenticateUser(email: string, password: string) {
  const user = mockUsers.find((user) => user.email === email);

  if (user) {
    console.log("Stored password hash:", user.password);
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isPasswordMatch);

    if (isPasswordMatch) {
      return { id: user.id, email: user.email };
    } else {
      console.log("Password mismatch");
    }
  } else {
    console.log("No user found for the given email");
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
            return user;
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/profile/signin',
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
