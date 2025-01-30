// app/profile/page.tsx

'use client';

import { useSession, signOut, signIn } from 'next-auth/react';

declare module 'next-auth' {
  interface User {
    name?: string | null;
    teamName?: string | null;
  }

  interface Session {
    user?: User;
  }
}

import { title } from "@/components/primitives";
import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <div>Loading...</div>;

  if (!session) {
    return (
      <div>
        <h1 className={title()}>Profile</h1>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h1 className="text-xl font-semibold text-center">
            You need to be signed in to view this page.
          </h1>
          <div className="flex space-x-4 mt-4">
            <Button onPress={() => signIn(undefined, { callbackUrl: "/profile" })} className="px-6 py-3">
              Sign In
            </Button>
            <Button onPress={() => router.push('/profile/register')} className="px-6 py-3">
              Register
            </Button>
          </div>
        </div>
      </div>
    );
  }  

  // Use player's name or team's name if available
  const displayName = session.user?.name || session.user?.teamName || "User";

  return (
    <div>
      <h1 className={title()}>Profile</h1>
      <div className="centered-container">
        <h2>Welcome, {displayName}!</h2>
        <Button onPress={() => signOut()}>Sign Out</Button>
      </div>
    </div>
  );
}
