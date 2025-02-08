// app/team/page.tsx

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { title } from "@/components/primitives";
import { Input, Modal, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { useRouter } from "next/navigation";

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
  const { data: session, status } = useSession();
  const [teams, setTeams] = useState<Team[]>([]);
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [teamName, setTeamName] = useState<string>(""); 
  const [showModal, setShowModal] = useState(false);  // Modal visibility
  const router = useRouter();

  const accountType = (session?.user as CustomUser)?.accountType;

  useEffect(() => {
    if (session) {
      console.log("Session data:", session);  // Debugging log
      console.log("Account type:", accountType);  // Debugging log
    }
  }, [session, accountType]);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teams");
      if (!res.ok) throw new Error("Failed to fetch teams");
      const data = await res.json();
      console.log("Fetched teams:", data); // Debugging log
      setTeams(data.teams);
  
      // If account type is "team" and they haven't created a team yet:
      if (accountType === "team") {
        const teamRes = await fetch(`/api/teams/my-team?email=${session?.user?.email}`);
        
        if (teamRes.ok) {
          const teamData = await teamRes.json();
          console.log("User team data:", teamData); // Debugging log
          setUserTeam(teamData.team);
        } else {
          // No team exists for this account, prompt to create one
          setUserTeam(null);  // Set userTeam to null to show "Create Team" UI
        }
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  }, [accountType, session]);  

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
              onPress={() => router.push("/profile/signin?callbackUrl=/team")}
              className="button"
            >
              Sign In
            </Button>
            <Button
              onPress={() => router.push("/profile/register?callbackUrl=/team")}
              className="button"
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const renderView = () => {
    if (loading) {
      return <p>Loading teams...</p>;  // Show loading state while fetching
    }
  
    switch (accountType) {
      case "player":
        return (
          <div>
            <h2>Available Teams</h2>
            {teams.map((team) => (
              <div key={team.id} className="p-4 border mb-2 rounded">
                <p>{team.teamName}</p>
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
        );
      case "team":
        return (
          <div className="flex">
            {/* Left side: Table of Players */}
            <div className="w-3/5 mr-4">
            {userTeam ? (
              <>
                <h2 className="text-xl font-bold text-left mb-2">{userTeam.teamName} Roster</h2>
                <Table aria-label="Team Roster" classNames={{ table: "min-w-full" }}>
                  <TableHeader>
                    <TableColumn>Name</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {userTeam.players.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell>{player.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : (
              <p>You don't have a team yet. Please create one!</p>
            )}

            </div>
  
            {/* Right side: Buttons */}
            <div className="w-2/5">
            <h2 className="text-xl font-bold mb-2">Pending Requests</h2>
            {userTeam?.joinRequests?.length ? (
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
          </div>
        );
      default:
        return <p>No valid account type found. Please contact support.</p>;
    }
  };  

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h1 className={title()}>Team</h1>
      </div>
      {renderView()}
    </div>
  );
}
