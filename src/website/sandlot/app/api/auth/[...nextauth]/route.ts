// app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

let mockUsers: { id: string; email: string; password: string }[] = [];

async function authenticateUser(email: string, password: string) {
  // Dynamically use the mockUsers array, which is now updated after registration
  const user = mockUsers.find((user) => user.email === email);

  if (user) {
    console.log("Stored password hash:", user.password);  // Log the stored password hash
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log("Password entered:", password);  // Log the password entered by the user
    console.log("Password match result:", isPasswordMatch);  // Log the result of comparison

    if (isPasswordMatch) {
      return { id: user.id, email: user.email };
    } else {
      console.log("Password mismatch");
    }
  } else {
    console.log("No user found for the given email");
  }

  return null;  // If no match, return null (will trigger 401 error)
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
