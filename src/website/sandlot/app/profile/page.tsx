'use client';

import { useEffect, useState } from 'react';
import { getSession, signOut, signIn } from 'next-auth/react';
import { Session } from 'next-auth'; 
import { title } from "@/components/primitives";
import { Button, Card, CardBody } from '@heroui/react';
import { useRouter } from 'next/navigation';
import ChangeInfoModal from './ChangeInfoModal'; // Import the ChangeInfoModal component

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalInitialValue, setModalInitialValue] = useState('');
  const [modalSubmitHandler, setModalSubmitHandler] = useState<(value: string, confirmValue?: string) => void>(() => {});
  const [isPasswordModal, setIsPasswordModal] = useState(false);
  const [isNameChange, setIsNameChange] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();
  }, []);

  const handleChangeName = () => {
    setModalTitle('Change Name');
    setModalInitialValue(`${session?.user?.firstname || ''} ${session?.user?.lastname || ''}`);
    setModalSubmitHandler(() => (firstName: string, lastName?: string) => {
      // Implement the logic to change the name
      alert(`Name changed to: ${firstName} ${lastName}`);
      setIsModalOpen(false);
    });
    setIsPasswordModal(false);
    setIsNameChange(true);
    setIsModalOpen(true);
  };

  const handleChangeTeamName = () => {
    setModalTitle('Change Team Name');
    setModalInitialValue(session?.user?.teamName || '');
    setModalSubmitHandler(() => (value: string) => {
      // Implement the logic to change the team name
      alert(`Team Name changed to: ${value}`);
      setIsModalOpen(false);
    });
    setIsPasswordModal(false);
    setIsNameChange(false);
    setIsModalOpen(true);
  };

  const handleChangeEmail = () => {
    setModalTitle('Change Email');
    setModalInitialValue(session?.user?.email || '');
    setModalSubmitHandler(() => (value: string) => {
      // Implement the logic to change the email
      alert(`Email changed to: ${value}`);
      setIsModalOpen(false);
    });
    setIsPasswordModal(false);
    setIsNameChange(false);
    setIsModalOpen(true);
  };

  const handleChangePassword = () => {
    setModalTitle('Change Password');
    setModalInitialValue('');
    setModalSubmitHandler(() => (value: string, confirmValue?: string) => {
      if (value !== confirmValue) {
        alert('Passwords do not match');
        return;
      }
      // Implement the logic to change the password
      alert(`Password changed to: ${value}`);
      setIsModalOpen(false);
    });
    setIsPasswordModal(true);
    setIsNameChange(false);
    setIsModalOpen(true);
  };

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

  const displayName = session.user?.firstname || session.user?.teamName || "User";
  const userRole = session.user?.role;
  const userGender = session.user?.gender || "Not specified";
  const userTeam = session.user?.teamName || "Not assigned to a team";

  return (
    <div>
      {/* Profile Header with Welcome Message */}
      <h1 className={title()}>Profile</h1>
      <div className="text-center mb-8">
        <p className="text-lg mt-2">
          Welcome {displayName}!
        </p>
        <p>
          Manage your account details here
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="flex justify-between">
        {/* Left side: Profile Card */}
        <div className="w-3/5 mr-8">
          <h2 className="text-xl font-semibold mb-4">Account Info</h2>
          <Card className="max-w-full">
            <CardBody>
              <p><strong>Name:</strong> {displayName} {session.user?.lastname}</p>
              <p><strong>Role:</strong> {userRole}</p>
              {userRole === "player" && (<p><strong>Gender:</strong> {userGender}</p>)}
              {userRole === "player" && (<p><strong>Team:</strong> {userTeam}</p>)}
            </CardBody>
          </Card>
        </div>

        {/* Right side: Buttons */}
        <div className="w-2/5">
          <h2 className="text-xl font-semibold mb-4">Modify Info</h2>
          {userRole === "player" && (
            <Button
              className="button mb-4 w-full"
              onPress={handleChangeName}
            >
              Change Name
            </Button>
          )}
          {userRole === "team" && (
            <Button
              className="button mb-4 w-full"
              onPress={handleChangeTeamName}
            >
              Change Team Name
            </Button>
          )}
          {/* Only show if userRole is a player */}
          {/* {userRole === "player" && (
            <Button
              className="button mb-4 w-full"
              onPress={handleChangeGender}
            >
              Change Gender
            </Button>
          )} */}
          <Button
            className="button mb-4 w-full"
            onPress={handleChangePassword}
          >
            Change Password
          </Button>
          {userRole != "team" && (
            <Button
              className="button mb-4 w-full"
              onPress={handleChangeEmail}
            >
              Change Email
            </Button>
          )}
        </div>
      </div>
      {/* Sign Out Button */}
      <div className="flex justify-center mt-8">
        <Button onPress={() => signOut({ callbackUrl: '/profile/signin' })} className="button">
          Sign Out
        </Button>
      </div>

      {/* Modal for changing name, email, or password */}
      <ChangeInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={modalSubmitHandler}
        title={modalTitle}
        initialValue={modalInitialValue}
        isPassword={isPasswordModal}
        isNameChange={isNameChange}
      />
    </div>
  );
}