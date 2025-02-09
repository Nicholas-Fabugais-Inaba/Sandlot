// app/profile/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { getSession, signOut, signIn } from 'next-auth/react';
import { Session } from 'next-auth'; // Import Session from next-auth
import { title } from "@/components/primitives";
import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!session) {
    return (
      <div>
        <h1 className={title()}>Profile</h1>
        <div className="centered-container mt-32">
          <h1 className="text-xl font-semibold text-center">
            You need to be signed in to view this page.
          </h1>
          <div className="flex space-x-4 mt-4">
            <Button onPress={() => signIn(undefined, { callbackUrl: "/profile" })} className="button">
              Sign In
            </Button>
            <Button onPress={() => router.push('/profile/register')} className="button">
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
        <Button onPress={() => signOut({ callbackUrl: '/profile/signin' })} className="button">Sign Out</Button>
      </div>
    </div>
  );
}
