// app/team/page.tsx

"use client";

import React, { useEffect, useState, useCallback } from "react";
// import { useSession } from "next-auth/react";
import { title } from "@/components/primitives";
import { Input, Modal, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Session } from 'next-auth'; 
import { getSession} from 'next-auth/react';



interface Team {
  id: string;
  teamName: string;
  players: { id: string; name: string; email: string }[];
  joinRequests: { id: string; name: string; email: string }[];
  captain: { id: string; name: string; email: string }; // Add captain info
}

export default function TeamPage() {
  // const { data: session, status } = useSession();
  const [session, setSession] = useState<Session | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   if (session) {
  //     console.log("Session data:", session);
  //     console.log("Account type:", session.user.role);
  //   }
  // }, [session, session?.user.role]);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();
  }, []);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teams");
      if (!res.ok) throw new Error("Failed to fetch teams");
      const data = await res.json();
      console.log("Fetched teams:", data);
      setTeams(data.teams);
  
      if (session?.user.role === "team") {
        const teamRes = await fetch(`/api/teams/my-team?email=${session?.user?.email}`);
      
        if (teamRes.ok) {
          const teamData = await teamRes.json();
          console.log("User team data:", teamData);
      
          const joinRequestsWithDetails = await Promise.all(
            teamData.team.joinRequests.map(async (request: { id: string; name: string; email: string }) => {
              const userRes = await fetch(`/api/users?email=${request.email}`);
              if (userRes.ok) {
                const userData = await userRes.json();
                return { id: userData.id, name: userData.name, email: request.email };
              }
              return { id: request.id, name: request.name, email: request.email };
            })
          );          
      
          setUserTeam({ ...teamData.team, joinRequests: joinRequestsWithDetails });
        }
      } else if (session?.user.role === "player") {
        // Get player-specific data if player is authenticated
        const playerTeamRes = await fetch(`/api/teams/player-team?email=${session?.user.email}`);
        if (playerTeamRes.ok) {
          const playerTeamData = await playerTeamRes.json();
          setUserTeam(playerTeamData.team);
        }
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user.role, session]);

  useEffect(() => {
    if (loading) {
      fetchTeams();
    }
  }, [loading, fetchTeams]);

  const handleAction = async (
    url: string,
    method: "POST" | "DELETE",
    body?: object,
    successMessage?: string
  ) => {
    setActionLoading(true);
    try {
      const res = await fetch(url, {
        method,
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

  if (loading) return <p>Loading...</p>;

  if (!session) {
    return (
      <div>
        <h1 className={title()}>Team</h1>
        <div className="centered-container mt-32">
          <h1 className="text-xl font-semibold text-center">You need to be signed in to view this page.</h1>
          <div className="flex space-x-4 mt-4">
            <Button onPress={() => router.push("/profile/signin?callbackUrl=/team")} className="button">Sign In</Button>
            <Button onPress={() => router.push("/profile/register?callbackUrl=/team")} className="button">Register</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className={title()}>Team</h1>
      
      {/* Player View: Available Teams */}
      {session.user.role === "player" && !userTeam ? (
        <div>
          <h2 className="text-xl font-semibold text-center mb-4 mt-4">Available Teams</h2>
          {teams.length ? (
            teams.map((team) => (
              <div key={team.id} className="p-4 border mb-2 rounded">
                <p>{team.teamName}</p>
                <Button
                  disabled={actionLoading}
                  className="button"
                  onPress={() => handleAction(
                    `/api/teams/${team.id}/join`,
                    "POST",
                    { playerEmail: session.user.email },
                    "Join request sent!"
                  )}
                >
                  Request to Join
                </Button>
              </div>
            ))
          ) : (
            <p>No available teams at the moment.</p>
          )}
        </div>
      ) : session.user.role === "player" && userTeam ? (
        // Player View After Join Request Accepted
        <div className="flex">
          {/* Left Section: Team Roster */}
          <div className="w-3/5 mr-4">
            <h2 className="text-xl font-bold mb-2">{userTeam.teamName} Roster</h2>
            <Table aria-label="Team Roster" classNames={{ table: "min-w-full" }}>
              <TableHeader>
                <TableColumn>Name</TableColumn>
              </TableHeader>
              <TableBody>
                {userTeam.players.length ? (
                  userTeam.players.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>{player.name}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell>No players yet</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Right Section: Team Info (Captain's Info and Leave Team) */}
          <div className="w-2/5">
            <h2 className="text-xl font-bold mb-2">{userTeam.teamName}'s Info</h2>
            <Button
              onPress={() => alert(`Captain's Info: ${userTeam.captain.name} (${userTeam.captain.email})`)}
              className="button mb-4"
            >
              Captain's Info
            </Button>
            <Button
              onPress={() => handleAction(
                `/api/teams/${userTeam.id}/leave`,
                "POST",
                { playerEmail: session.user.email },
                "You have left the team"
              )}
              className="button"
            >
              Leave Team
            </Button>
          </div>
        </div>
      ) : session.user.role === "team" ? (
        // Team View: Team Roster and Pending Requests
        <div className="flex">
          <div className="w-3/5 mr-4">
            <h2 className="text-xl font-bold mb-2">{session.user.teamName || "Your Team"} Roster</h2>
            <Table aria-label="Team Roster" classNames={{ table: "min-w-full" }}>
              <TableHeader>
                <TableColumn>Name</TableColumn>
              </TableHeader>
              <TableBody>
                {(userTeam?.players?.length ? userTeam.players : [{ id: "1", name: "Player 1" }, { id: "2", name: "Player 2" }]).map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>{player.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="w-2/5">
            <h2 className="text-xl font-bold mb-2">Pending Requests</h2>
            {(userTeam?.joinRequests?.length ? userTeam.joinRequests : [{ email: "request@domain.com", name: "John Doe" }]).map((request) => (
              <div key={request.email} className="p-4 border mb-2 rounded">
                <p>{request.name} ({request.email})</p>
                <Button
                  disabled={actionLoading}
                  className="button mr-2"
                  onPress={() => handleAction(
                    `/api/teams/${session.user.teamName}/accept`,
                    "POST",
                    { playerEmail: request.email },
                    "Player added!"
                  )}
                >
                  Accept
                </Button>
                <Button
                  disabled={actionLoading}
                  className="button"
                  onPress={() => handleAction(
                    `/api/teams/${session.user.teamName}/deny`,
                    "POST",
                    { playerEmail: request.email },
                    "Request denied."
                  )}
                >
                  Deny
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );  
}
