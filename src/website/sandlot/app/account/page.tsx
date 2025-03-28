"use client";

import { act, useEffect, useState } from "react";
import { getSession, signOut, signIn } from "next-auth/react";
import { Session } from "next-auth";
import { Button, Card, CardBody, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";

import updatePlayerEmail from "../functions/updatePlayerEmail";
import updatePlayerName from "../functions/updatePlayerName";
import updatePlayerPassword from "../functions/updatePlayerPassword";
import updateTeamName from "../functions/updateTeamName";
import updateTeamUsername from "../functions/updateTeamUsername";
import updateTeamPassword from "../functions/updateTeamPassword";

import ChangeInfoModal from "./ChangeInfoModal"; // Import the ChangeInfoModal component

import { title } from "@/components/primitives";
import getPlayerActiveTeam from "../functions/getPlayerActiveTeam";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [teamName, setTeamName] = useState<string>("team_name");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalInitialValue, setModalInitialValue] = useState("");
  const [modalSubmitHandler, setModalSubmitHandler] = useState<
    (value: string, confirmValue?: string) => void
  >(() => {});
  const [isPasswordModal, setIsPasswordModal] = useState(false);
  const [isNameChange, setIsNameChange] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        if (session.user.role === "player") {
          try {
            const activeTeamData = await getPlayerActiveTeam(session.user.id);
            setTeamName(activeTeamData.team_name);
          } catch (error) {
            // Handle any error from getPlayerActiveTeam gracefully
            console.error("Error fetching player active team:", error);
            setTeamName("No team assigned");
          }
        } else if (session.user.role === "team") {
          setTeamName(session.user.teamName);
        }
        setSession(session);
      }
  
      setLoading(false); // Set loading to false once session is fetched
    };
  
    fetchSession();
  }, []);  

  const handleChangeName = () => {
    setModalTitle("Change Name");
    setModalInitialValue(
      `${session?.user?.firstname || ""} ${session?.user?.lastname || ""}`,
    );
    setModalSubmitHandler(() => (firstName: string, lastName?: string) => {
      // Implement the logic to change the name
      alert(`Name changed to: ${firstName} ${lastName}`);
      if (session) {
        updatePlayerName({
          player_id: session.user.id,
          first_name: firstName,
          last_name: lastName ? lastName : "",
        });
        session.user.firstname = firstName;
      }
      setIsModalOpen(false);
    });
    setIsPasswordModal(false);
    setIsNameChange(true);
    setIsModalOpen(true);
  };

  const handleChangeTeamName = () => {
    setModalTitle("Change Team Name");
    setModalInitialValue(session?.user?.teamName || "");
    setModalSubmitHandler(() => (value: string) => {
      if (session) {
        updateTeamName({ team_id: session.user.id, new_team_name: value });
        session.user.teamName = value;
      }
      setIsModalOpen(false);
    });
    setIsPasswordModal(false);
    setIsNameChange(false);
    setIsModalOpen(true);
  };

  const handleChangeTeamUsername = () => {
    setModalTitle("Change Team Username");
    setModalInitialValue(session?.user?.username || "");
    setModalSubmitHandler(() => (value: string) => {
      if (session) {
        updateTeamUsername({ team_id: session.user.id, new_username: value });
        session.user.username = value;
      }
      setIsModalOpen(false);
    });
    setIsPasswordModal(false);
    setIsNameChange(false);
    setIsModalOpen(true);
  };

  const handleChangeEmail = () => {
    setModalTitle("Change Email");
    setModalInitialValue(session?.user?.email || "");
    setModalSubmitHandler(() => (value: string) => {
      if (
        session?.user.role === "player" ||
        session?.user.role === "commissioner"
      ) {
        updatePlayerEmail({ player_id: session.user.id, new_email: value });
        session.user.email = value;
      }
      setIsModalOpen(false);
    });
    setIsPasswordModal(false);
    setIsNameChange(false);
    setIsModalOpen(true);
  };

  const handleChangePassword = () => {
    setModalTitle("Change Password");
    setModalInitialValue("");
    setModalSubmitHandler(() => (value: string, confirmValue?: string) => {
      if (value !== confirmValue) {
        alert("Passwords do not match");

        return;
      }
      if (
        session?.user.role === "player" ||
        session?.user.role === "commissioner"
      ) {
        updatePlayerPassword({
          player_id: session.user.id,
          new_password: value,
        });
      } else if (session?.user.role === "team") {
        updateTeamPassword({ team_id: session.user.id, new_password: value });
      }
      setIsModalOpen(false);
    });
    setIsPasswordModal(true);
    setIsNameChange(false);
    setIsModalOpen(true);
  };

  // If loading, show a global spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Spinner label="Loading Account Information..." size="lg" />
      </div>
    );
  }

  if (!session) {
    return (
      <div>
        <h1 className={title()}>Account</h1>
        <div className="centered-container mt-32">
          <h1 className="text-xl font-semibold text-center">
            You need to be signed in to view this page.
          </h1>
          <div className="flex space-x-4 mt-4">
            <Button
              className="button"
              onPress={() => signIn(undefined, { callbackUrl: "/account" })}
            >
              Sign In
            </Button>
            <Button
              className="button"
              onPress={() => router.push("/account/register")}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const displayName =
    session.user?.firstname || session.user?.teamName || "User";
  const teamUsername = session.user?.username;
  const userRole = session.user?.role;
  const userGender = session.user?.gender || "Not specified";
  const userTeam = teamName || "Not assigned to a team";

  return (
    <div>
      {/* Account Header with Welcome Message */}
      <h1 className={title()}>Account</h1>
      <div className="text-center mb-8">
        <p className="text-lg mt-2">Welcome {displayName}!</p>
        <p>Manage your account details here</p>
      </div>

      {/* Main Content Layout */}
      <div className="flex justify-between">
        {/* Left side: Account Card */}
        <div className="w-3/5 mr-8">
          <h2 className="text-xl font-semibold mb-4">Account Info</h2>
          <Card className="max-w-full">
            <CardBody>
              <p>
                <strong>Display Name:</strong> {displayName}{" "}
                {session.user?.lastname}
              </p>
              {userRole === "team" && (
                <p>
                  <strong>Username:</strong> {teamUsername}
                </p>
              )}
              <p>
                <strong>Role:</strong> {capitalizeFirstLetter(userRole)}
              </p>
              {userRole === "player" && (
                <p>
                  <strong>Gender:</strong> {capitalizeFirstLetter(userGender)}
                </p>
              )}
              {userRole === "player" && (
                <p>
                  <strong>Team:</strong> {userTeam}
                </p>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right side: Buttons */}
        <div className="w-2/5">
          <h2 className="text-xl font-semibold mb-4">Modify Team Info</h2>
          {userRole === "player" && (
            <Button className="button mb-4 w-full" onPress={handleChangeName}>
              Change Name
            </Button>
          )}
          {userRole === "team" && (
            <Button
              className="button mb-4 w-full"
              onPress={handleChangeTeamName}
            >
              Change Display Name
            </Button>
          )}
          {userRole === "team" && (
            <Button
              className="button mb-4 w-full"
              onPress={handleChangeTeamUsername}
            >
              Change Username
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
          <Button className="button mb-4 w-full" onPress={handleChangePassword}>
            Change Password
          </Button>
          {userRole != "team" && (
            <Button className="button mb-4 w-full" onPress={handleChangeEmail}>
              Change Email
            </Button>
          )}
        </div>
      </div>
      {/* Sign Out Button */}
      <div className="flex justify-center mt-8">
        <Button
          className="button"
          onPress={() => signOut({ callbackUrl: "/account/signin" })}
        >
          Sign Out
        </Button>
      </div>

      {/* Modal for changing name, email, or password */}
      <ChangeInfoModal
        initialValue={modalInitialValue}
        isNameChange={isNameChange}
        isOpen={isModalOpen}
        isPassword={isPasswordModal}
        title={modalTitle}
        onClose={() => setIsModalOpen(false)}
        onSubmit={modalSubmitHandler}
      />
    </div>
  );
}