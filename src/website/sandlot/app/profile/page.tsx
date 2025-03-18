// app/profile/page.tsx

"use client";

import { useEffect, useState } from "react";
import { getSession, signOut, signIn } from "next-auth/react";
import { Session } from "next-auth";
import { title } from "@/components/primitives";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from "@heroui/react";
import { useRouter } from "next/navigation";

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
            <Button
              onPress={() => signIn(undefined, { callbackUrl: "/profile" })}
              className="button"
            >
              Sign In
            </Button>
            <Button
              onPress={() => router.push("/profile/register")}
              className="button"
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const displayName = session.user?.name || session.user?.teamName || "User";
  const userRole = session.user?.role;
  const userGender = session.user?.gender || "Not specified";
  const userTeam = session.user?.teamName || "Not assigned to a team";

  return (
    <div>
      {/* Profile Header with Welcome Message */}
      <h1 className={title()}>Profile</h1>
      <div className="text-center mb-8">
        <p className="text-lg mt-2">Welcome {displayName}!</p>
        <p>Manage your account details here</p>
      </div>

      {/* Main Content Layout */}
      <div className="flex justify-between">
        {/* Left side: Profile Card */}
        <div className="w-3/5 mr-8">
          <h2 className="text-xl font-semibold mb-4">Account Info</h2>
          <Card className="max-w-full">
            <CardBody>
              <p>
                <strong>Name:</strong> {displayName}
              </p>
              <p>
                <strong>Role:</strong> {userRole}
              </p>
              <p>
                <strong>Gender:</strong> {userGender}
              </p>
              <p>
                <strong>Team:</strong> {userTeam}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Right side: Buttons */}
        <div className="w-2/5">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <Button
            className="button mb-4 w-full"
            onPress={() => alert("Change Name")}
          >
            Change Name
          </Button>
          <Button
            className="button mb-4 w-full"
            onPress={() => alert("Change Gender")}
          >
            Change Gender
          </Button>
          <Button
            className="button mb-4 w-full"
            onPress={() => alert("Change Password")}
          >
            Change Password
          </Button>
          <Button
            className="button mb-4 w-full"
            onPress={() => alert("Change Email")}
          >
            Change Email
          </Button>
        </div>
      </div>
      {/* Sign Out Button */}
      <div className="flex justify-center mt-8">
        <Button
          onPress={() => signOut({ callbackUrl: "/profile/signin" })}
          className="button"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
