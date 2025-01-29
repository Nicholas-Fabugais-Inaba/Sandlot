"use client";

import { useSession, signIn, signOut } from 'next-auth/react';
import { title } from "@/components/primitives";
import { Button } from '@heroui/react';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;

  if (!session) {
    return (
      <div>
        <h1>You need to be signed in to view this page.</h1>
        <Button onPress={() => signIn(undefined, { callbackUrl: "/profile" })}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className={title()}>Profile</h1>
      <h2>Welcome, {session.user?.name}</h2>
      <Button onPress={() => signOut()}>Sign Out</Button>
    </div>
  );
}
