'use client';

import { useSession, signOut, signIn } from 'next-auth/react';
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
        <div className="centered-container">
          <h1>You need to be signed in to view this page.</h1>
          <Button onPress={() => signIn(undefined, { callbackUrl: "/profile" })}>
            Sign In
          </Button>
          <Button onPress={() => router.push('/profile/register')}>Register</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className={title()}>Profile</h1>
      <h2>Welcome, {session.user?.email}</h2>
      <Button onPress={() => signOut()}>Sign Out</Button>
    </div>
  );
}
