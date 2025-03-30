"use client";

import { act, useEffect, useState } from "react";
import { getSession, signOut, signIn } from "next-auth/react";
import { Session } from "next-auth";
import { Button, Card, CardBody, Spinner, Alert } from "@heroui/react";
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

import "../Global.css";
import getPlayerAccountData from "../functions/getPlayerAccountInfo";
import getTeamAccountData from "../functions/getTeamAccountData";
import getSeasonState from "@/app/functions/getSeasonState";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

interface AccountInfo {
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  teamName?: string;
  teams?: string[];
  username?: string;
  active?: boolean;
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
  const [isEmailChange, setIsEmailChange] = useState(false); // New state for email change
  const [isTeamDisplayChange, setIsTeamDisplayChange] = useState(false); // New state for team display name change
  const [isTeamUsernameChange, setIsTeamUsernameChange] = useState(false); // New state for team username change  
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({});
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [seasonState, setSeasonState] = useState<any>();
  

  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      // If role is player, use getPlayer(), if role is team, use getTeam(), if role is commissioner do nothing
      let response = await getSeasonState();
      setSeasonState(response);

      if (session) {
        if (session.user.role === "player") {
          try {
            const accountInfoResponse = await getPlayerAccountData(session.user.id);
            setAccountInfo(accountInfoResponse);
            console.log("Account Info:", accountInfoResponse);
            const activeTeamData = await getPlayerActiveTeam(session.user.id);
            setTeamName(activeTeamData.team_name);
          } catch (error) {
            console.error("Error fetching player active team:", error);
            setTeamName("No team assigned");
          }
        } else if (session.user.role === "team") {
          const accountInfoResponse = await getTeamAccountData(session.user.id);
          setAccountInfo(accountInfoResponse);
          console.log("Account Info:", accountInfoResponse);
          setTeamName(accountInfoResponse.teamName || "No team name");
        }
        setSession(session);
      }
  
      setLoading(false); // Set loading to false once session is fetched
    };
  
    fetchSession();
  }, []);  

  const handleChangeName = () => {
    setModalTitle("Change Name");
    setModalInitialValue(""); // Clear initial value
    setModalSubmitHandler(() => (firstName: string, lastName?: string) => {
      alert(`Name changed to: ${firstName} ${lastName}`);
      // Implement the logic to change the name
      if (session) {
        updatePlayerName({
          player_id: session.user.id,
          first_name: firstName,
          last_name: lastName ? lastName : "",
        });
  
        // Update the session and accountInfo state
        session.user.firstname = firstName;
        setAccountInfo((prev) => ({
          ...prev,
          firstName: firstName,
          lastName: lastName || "",
        }));

        // Show success alert
        setAlertMessage(`Name successfully changed to: ${firstName} ${lastName}`);
        setIsAlertVisible(true);

        // Hide alert after 3 seconds
        setTimeout(() => {
          setIsAlertVisible(false);
        }, 3000);
      }
      setIsModalOpen(false);
    });
    setIsPasswordModal(false);
    setIsNameChange(true);
    setIsEmailChange(false);
    setIsTeamDisplayChange(false); // Ensure this is set to false
    setIsTeamUsernameChange(false); // Ensure this is set to false
    setIsModalOpen(true);
  };

  const handleChangeTeamName = () => {
    setModalTitle("Change Team Name");
    setModalInitialValue(accountInfo.teamName || ""); // Use accountInfo for the initial value
    setModalSubmitHandler(() => (value: string) => {
      if (session) {
        updateTeamName({ team_id: session.user.id, new_team_name: value }); // Use session for the team ID
        setAccountInfo((prev) => ({
          ...prev,
          teamName: value, // Update accountInfo with the new team name
        }));
  
        // Show success alert
        setAlertMessage(`Team Name successfully changed to: ${value}`);
        setIsAlertVisible(true);
  
        // Hide alert after 3 seconds
        setTimeout(() => {
          setIsAlertVisible(false);
        }, 3000);
      }
      setIsModalOpen(false);
    });
    setIsPasswordModal(false);
    setIsNameChange(false);
    setIsEmailChange(false);
    setIsTeamDisplayChange(true); // Ensure this is set to true
    setIsTeamUsernameChange(false); // Ensure this is set to false
    setIsModalOpen(true);
  };
  
  const handleChangeTeamUsername = () => {
    setModalTitle("Change Team Username");
    setModalInitialValue(accountInfo.username || ""); // Use accountInfo for the initial value
    setModalSubmitHandler(() => (value: string) => {
      if (session) {
        updateTeamUsername({ team_id: session.user.id, new_username: value }); // Use session for the team ID
        setAccountInfo((prev) => ({
          ...prev,
          username: value, // Update accountInfo with the new username
        }));
  
        // Show success alert
        setAlertMessage(`Username successfully changed to: ${value}`);
        setIsAlertVisible(true);
  
        // Hide alert after 3 seconds
        setTimeout(() => {
          setIsAlertVisible(false);
        }, 3000);
      }
      setIsModalOpen(false);
    });
    setIsPasswordModal(false);
    setIsNameChange(false);
    setIsEmailChange(false);
    setIsTeamDisplayChange(false); // Ensure this is set to false
    setIsTeamUsernameChange(true); // Ensure this is set to true
    setIsModalOpen(true);
  };
  
  const handleChangeEmail = () => {
    setModalTitle("Change Email");
    setModalInitialValue(accountInfo.email || ""); // Use accountInfo for the initial value
    setModalSubmitHandler(() => (email: string, confirmEmail?: string) => {
      if (email !== confirmEmail) {
        alert("Emails do not match");
        return;
      }
      if (session?.user.role === "player" || session?.user.role === "commissioner") {
        updatePlayerEmail({ player_id: session.user.id, new_email: email }); // Use session for the player ID
        setAccountInfo((prev) => ({
          ...prev,
          email: email, // Update accountInfo with the new email
        }));

        // Show success alert
        setAlertMessage(`Email successfully changed to: ${email}`);
        setIsAlertVisible(true);

        // Hide alert after 3 seconds
        setTimeout(() => {
          setIsAlertVisible(false);
        }, 3000);
      }
      setIsModalOpen(false);
    });
    setIsPasswordModal(false); // Reset other modal states
    setIsNameChange(false);    // Reset other modal states
    setIsEmailChange(true);    // Ensure this is set to true
    setIsTeamDisplayChange(false); // Reset other modal states
    setIsTeamUsernameChange(false); // Reset other modal states
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

        // Show success alert
        setAlertMessage(`Password successfully changed`);
        setIsAlertVisible(true);

        // Hide alert after 3 seconds
        setTimeout(() => {
          setIsAlertVisible(false);
        }, 3000);
      } else if (session?.user.role === "team") {
        updateTeamPassword({ team_id: session.user.id, new_password: value });

        // Show success alert
        setAlertMessage(`Password successfully changed`);
        setIsAlertVisible(true);

        // Hide alert after 3 seconds
        setTimeout(() => {
          setIsAlertVisible(false);
        }, 3000);
      }
      setIsModalOpen(false);
    });
    setIsPasswordModal(true);  // Ensure this is set to true
    setIsNameChange(false);    // Reset other modal states
    setIsEmailChange(false);   // Reset other modal states
    setIsTeamDisplayChange(false); // Reset other modal states
    setIsTeamUsernameChange(false); // Reset other modal states
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
      <div className="pageHeader">
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
              isDisabled={seasonState === "offseason"} 
            >
              Register
            </Button>
          </div>
          {seasonState === "offseason" && (
          <p className="text-sm text-red-500 text-center mt-2">
            League is currently offseason.
          </p>
        )}
        </div>
      </div>
    );
  }

  // const displayName =
  //   accountInfo.firstName || accountInfo.lastName || "User";
  // const teamUsername = accountInfo.username;
  const userRole = session.user?.role;

  return (
    <div>
      <div className="pageHeader">
        {/* Account Header with Welcome Message */}
        <h1 className={title()}>Account</h1>
        <div className="text-center mb-8">
          {userRole === "player" && (
            <p className="text-lg mt-2">Welcome {accountInfo.firstName}!</p>
          )}
          {userRole === "team" && (
            <p className="text-lg mt-2">Welcome {accountInfo.teamName} captain!</p>
          )}
          {userRole === "commissioner" && (
            <p className="text-lg mt-2">Welcome Commissioner!</p>
          )}
          {/* <p className="text-lg mt-2">Welcome {displayName}!</p> */}
          <p>Manage your account details here</p>
        </div>
      </div>
      {/* Main Content Layout */}
      <div className="flex justify-between">
        {/* Left side: Account Card */}
        <div className="w-3/5 mr-8">
          <h2 className="text-xl font-semibold mb-4">Account Info</h2>
          <Card className="max-w-full">
            <CardBody>
              {/* <p>
                <strong>Display Name:</strong> {displayName}{" "}
                {session.user?.lastname}
              </p> */}
              {userRole === "player" && (
                <p>
                  <strong>Name:</strong> {accountInfo.firstName}{" "}
                  {accountInfo.lastName}
                </p>
              )}
              {userRole === "team" && (
                <p>
                  <strong>Team Name:</strong> {accountInfo.teamName}
                </p>
              )}
              {userRole === "team" && (
                <p>
                  <strong>Username:</strong> {accountInfo.username}
                </p>
              )}
              <p>
                <strong>Role:</strong> {capitalizeFirstLetter(userRole)}
              </p>
              {userRole === "player" && (
                <p>
                  <strong>Gender:</strong> {capitalizeFirstLetter(capitalizeFirstLetter(accountInfo.gender || "Not specified"))}
                </p>
              )}
              {userRole === "player" && (
                <p>
                  <strong>
                    {accountInfo.teams && Object.keys(accountInfo.teams).length > 1
                      ? "Teams:"
                      : "Team:"}
                  </strong>{" "}
                  {accountInfo.teams && Object.keys(accountInfo.teams).length > 0
                    ? Object.values(accountInfo.teams).join(", ")
                    : teamName || "Not assigned to a team"}
                </p>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right side: Buttons */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-4">Modify Account Info</h2>
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

      {/* Success Alert */}
      {isAlertVisible && (
        <Alert
          color="success"
          description={alertMessage}
          isVisible={isAlertVisible}
          title="Success"
          variant="faded"
          onClose={() => setIsAlertVisible(false)}
          className="fixed top-4 right-4 z-50 w-96"
        />
      )}

      {/* Modal for changing name, email, or password */}
      <ChangeInfoModal
        initialValue={modalInitialValue}
        isNameChange={isNameChange}
        isEmailChange={isEmailChange} // Pass the isEmailChange prop
        isTeamDisplayChange={isTeamDisplayChange} // Pass the isTeamChange prop
        isTeamUsernameChange={isTeamUsernameChange} // Pass the isTeamChange prop
        isOpen={isModalOpen}
        isPassword={isPasswordModal}
        title={modalTitle}
        onClose={() => setIsModalOpen(false)}
        onSubmit={modalSubmitHandler}
        firstName={accountInfo.firstName} // Pass firstName
        lastName={accountInfo.lastName}  // Pass lastName
/>
    </div>
  );
}