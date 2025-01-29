import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Define NextAuth configuration
const authOptions = {
  providers: [
    CredentialsProvider({
      // Configure your credentials provider
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
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
    // Add other providers if necessary
  ],
  pages: {
    signIn: '/profile/signin', // Custom sign-in page URL
    // Add other pages if necessary
  },
};

// Export the NextAuth handler
import { NextApiRequest, NextApiResponse } from 'next';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions);
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions);
}

async function authenticateUser(email: string, password: string) {
  // Replace this with your actual user authentication logic
  const users = [
    { id: "1", email: "user@example.com", password: "password123" },
    // Add more users as needed
  ];

  const user = users.find(user => user.email === email && user.password === password);
  if (user) {
    return { id: user.id, email: user.email };
  }
  return null;
}
