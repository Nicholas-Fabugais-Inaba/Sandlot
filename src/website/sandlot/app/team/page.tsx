// app/team/page.tsx

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { title } from "@/components/primitives";
import { Input, Modal, Button } from "@heroui/react";
import { useRouter } from "next/navigation"; // Add to navigate for Sign In/Register

interface Team {
  id: string;
  teamName: string;
  players: { id: string; name: string }[];
  joinRequests: { id: string; name: string }[];
}

interface CustomUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  accountType: "player" | "team";
}

export default function TeamPage() {
  const { data: session, status } = useSession(); // Using `status` to check session loading
  const [teams, setTeams] = useState<Team[]>([]);
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [teamName, setTeamName] = useState<string>(""); 
  const [showModal, setShowModal] = useState(false);
  const router = useRouter(); // Add router for navigation

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teams");
      if (!res.ok) throw new Error("Failed to fetch teams");
      const data = await res.json();
      setTeams(data.teams);

      if ((session?.user as unknown as CustomUser).accountType === "team") {
        if (session && session.user) {
          const teamRes = await fetch(`/api/teams/my-team?email=${session.user.email}`);
          if (!teamRes.ok) throw new Error("Failed to fetch user team");
          const teamData = await teamRes.json();
          setUserTeam(teamData.team);
        }
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchTeams();
    }
  }, [status, fetchTeams]);

  const handleAction = async (url: string, body?: object, successMessage?: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) throw new Error("Action failed");
      alert(successMessage || "Action successful");
      fetchTeams();
    } catch (error) {
      console.error("Error performing action:", error);
      alert("Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div>
        <h1 className={title()}>Team</h1>
        <div className="centered-container mt-32">
          <h1 className="text-xl font-semibold text-center">
            You need to be signed in to view this page.
          </h1>
          <div className="flex space-x-4 mt-4">
            <Button
              onPress={() => router.push(`/profile/signin?callbackUrl=/team`)} // Dynamic callback URL
              className="button"
            >
              Sign In
            </Button>
            <Button onPress={() => router.push(`/profile/register?callbackUrl=/team`)} className="button">
              Register
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className={title()}>Team</h1>
      
      {((session?.user as unknown as CustomUser)?.accountType === "player") ? (
        <div>
          <h2>Available Teams</h2>
          {teams.map((team) => (
            <div key={team.id} className="p-4 border mb-2 rounded">
              <p>{team.teamName}</p> {/* Display team name here */}
              <Button
                disabled={actionLoading}
                onPress={() => {
                  if (session?.user) {
                    handleAction(`/api/teams/${team.id}/join`, { playerEmail: session.user.email }, "Join request sent!");
                  }
                }}
              >
                Request to Join
              </Button>
            </div>
          ))}
        </div>
      ) : ((session?.user as unknown as CustomUser)?.accountType === "team") ? (
        userTeam ? (
          <div>
            <h2>{userTeam.teamName} Roster</h2> {/* Display team name here */}
            <ul>
              {userTeam.players.map((player) => (
                <li key={player.id}>{player.name}</li>
              ))}
            </ul>
            <h2>Pending Requests</h2>
            {userTeam.joinRequests.length > 0 ? (
              userTeam.joinRequests.map((request) => (
                <div key={request.id} className="p-4 border mb-2 rounded">
                  <p>{request.name}</p>
                  <Button
                    disabled={actionLoading}
                    onPress={() => {
                      if (session?.user) {
                        handleAction(`/api/teams/my-team/accept`, { playerEmail: request.id, captainEmail: session.user.email }, "Player added!");
                      }
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    disabled={actionLoading}
                    onPress={() => {
                      if (session?.user) {
                        handleAction(`/api/teams/my-team/deny`, { playerEmail: request.id, captainEmail: session.user.email }, "Request denied.");
                      }
                    }}
                  >
                    Deny
                  </Button>
                </div>
              ))
            ) : (
              <p>No pending requests.</p>
            )}
          </div>
        ) : (
          <div>
            <p>You have not created a team yet.</p>
            <Button disabled={actionLoading} onPress={() => setShowModal(true)}>Create Team</Button>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
              <h2>Create a Team</h2>
              <Input
                value={teamName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTeamName(e.target.value)}
                placeholder="Enter team name"
              />
              <Button
                disabled={actionLoading || !teamName}
                onPress={() => {
                  handleAction("/api/teams/create", { teamName }, "Team created!");
                  setShowModal(false);
                  setTeamName("");
                }}
              >
                Submit
              </Button>
            </Modal>
          </div>
        )
      ) : null}
    </div>
  );
}
