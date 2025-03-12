// app/team/page.tsx

"use client";

import React, { useEffect, useState, useCallback } from "react";
// import { useSession } from "next-auth/react";
import { title } from "@/components/primitives";
import { Input, Modal, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Session } from 'next-auth'; 
import { getSession } from 'next-auth/react';
import getTeamInfo from "../functions/getTeamInfo";
import { user } from "@heroui/theme";

// Define the interface for Team and User data
interface Team {
  id: number;
  team_name: string;
  captain_id: number;
  // players: { id: string; name: string; email: string }[];
  // joinRequests: { id: string; name: string; email: string }[];
  // captain: { id: string; name: string; email: string }; // Add captain info
}

// Define the interface for the body parameter in handleAction
interface JoinRequestBody {
  playerEmail: string;
  captainEmail: string;
}

interface Player {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: string;
}

// interface User {
//   userRole: string;
//   userTeamID: number;
//   userTeamName: string;
//   userTeamCaptain: string;
// }

export default function TeamPage() {
  // const { data: session, status } = useSession();
  const [session, setSession] = useState<Session | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [roster, setRoster] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>("");
  const [userTeamID, setUserTeamID] = useState<number | null>(null);
  // const [userData, setUserData] = useState<User | null>(null);

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
    };

    fetchSession();
  }, []);

  useEffect(() => {
    (async () => {
      // setUserData({
      //   userRole: session?.user.role || "",
      //   userTeamID: session?.user.team_id || null,
      //   userTeamName: session?.user.teamName || "",
      //   userTeamCaptain: session?.user. || ""
      // });
      setUserRole(session?.user.role || "");
      setUserTeamID(session?.user.team_id || null);
      if (session?.user.team_id) {
        let teamInfo = await getTeamInfo({team_id: session?.user.team_id});
        setRoster(teamInfo)
      }
    })();
    setLoading(false);

    console.log("Roster", roster);
  }, [session])

  // const fetchTeams = useCallback(async () => {
  //   setLoading(true);
    // try {
    //   const res = await fetch("/api/teams");
    //   if (!res.ok) throw new Error("Failed to fetch teams");
    //   const data = await res.json();
    //   console.log("Fetched teams:", data);
    //   setTeams(data.teams);
  
    //   if (session?.user.role === "team") {
    //     const teamRes = await fetch(`/api/teams/my-team?email=${session?.user?.email}`);
      
    //     if (teamRes.ok) {
    //       const teamData = await teamRes.json();
    //       console.log("User team data:", teamData);
      
    //       const joinRequestsWithDetails = await Promise.all(
    //         teamData.team.joinRequests.map(async (request: { id: string; name: string; email: string }) => {
    //           const userRes = await fetch(`/api/users?email=${request.email}`);
    //           if (userRes.ok) {
    //             const userData = await userRes.json();
    //             return { id: userData.id, name: userData.name, email: request.email };
    //           }
    //           return { id: request.id, name: request.name, email: request.email };
    //         })
    //       );          
      
    //       setUserTeam({ ...teamData.team, joinRequests: joinRequestsWithDetails });
    //     }
    //   } else if (session?.user.role === "player") {
    //     // Get player-specific data if player is authenticated
    //     const playerTeamRes = await fetch(`/api/teams/player-team?email=${session?.user.email}`);
    //     if (playerTeamRes.ok) {
    //       const playerTeamData = await playerTeamRes.json();
    //       setUserTeam(playerTeamData.team);
    //     }
    //   }      
    // } catch (error) {
    //   console.error("Error fetching teams:", error);
    // } finally {
    //   setLoading(false);
    // }
  // }, [session?.user.role, session]);

  // useEffect(() => {
  //   if (loading) {
  //     fetchTeams();
  //   }
  // }, [loading, fetchTeams]);

  const handleAction = async () => {};
  // const handleAction = async (
  //   url: string,
  //   method: "POST" | "DELETE",
  //   body?: object,
  //   successMessage?: string
  // ) => {
  //   setActionLoading(true);
  //   try {
  //     const res = await fetch(url, {
  //       method,
  //       headers: { "Content-Type": "application/json" },
  //       body: body ? JSON.stringify(body) : undefined,
  //     });
  //     if (!res.ok) throw new Error("Action failed");
  
  //     if (body?.playerEmail) {
  //       setUserTeam((prev) => {
  //         if (!prev) return prev;
  //         return {
  //           ...prev,
  //           joinRequests: prev.joinRequests.filter((r) => r.email !== body.playerEmail),
  //         };
  //       });
  //     }
  
  //     alert(successMessage || "Action successful");
  //   } catch (error) {
  //     console.error("Error performing action:", error);
  //     alert("Something went wrong");
  //   } finally {
  //     setActionLoading(false);
  //   }
  // };  

  return (
    <div>
      <h1 className={title()}>Team</h1>
      
      {/* Player View: Available Teams */}
      {userRole === "player" && !userTeamID ? (
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
                    // `/api/teams/${team.id}/join`,
                    // "POST",
                    // { playerEmail: session.user.email },
                    // "Join request sent!"
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
      ) : userRole === "player" && userTeamID ? (
        // Player View After Join Request Accepted
        <div className="flex">
          {/* Left Section: Team Roster */}
          <div className="w-3/5 mr-4">
            <h2 className="text-xl font-bold mb-2">{session?.user.teamName} Roster</h2>
            <Table aria-label="Team Roster" classNames={{ table: "min-w-full" }}>
              <TableHeader>
                <TableColumn>Name</TableColumn>
              </TableHeader>
              <TableBody>
                {roster.length ? (
                  roster.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>{player.first_name+" "+player.last_name}</TableCell>
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
            <h2 className="text-xl font-bold mb-2">{session?.user.teamName}'s Info</h2>
            <Button
              onPress={() => alert(`Captain's Info: ${"Temp captain name"} (${"Temp captain contact"})`)}
              className="button mb-4"
            >
              Captain's Info
            </Button>
            <Button
              onPress={() => handleAction(
                // `/api/teams/${userTeam.id}/leave`,
                // "POST",
                // { playerEmail: session.user.email },
                // "You have left the team"
              )}
              className="button"
            >
              Leave Team
            </Button>
          </div>
        </div>
      ) : userRole === "team" ? (
        // Team View: Team Roster and Pending Requests
        <div className="flex">
          <div className="w-3/5 mr-4">
            <h2 className="text-xl font-bold mb-2">{session?.user.teamName || "Your Team"} Roster</h2>
            <div className="max-h-80 overflow-y-auto p-2">
              <Table aria-label="Team Roster" classNames={{ table: "min-w-full" }}>
                <TableHeader>
                  {["name", "contact"].map((key) => (
                    <TableColumn key={key} allowsSorting>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </TableColumn>
                  ))}
                </TableHeader>
                <TableBody>
                  {roster ? (roster.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell className="py-2 column-name">{player.first_name+" "+player.last_name}</TableCell>
                      <TableCell className="py-2 column-contact">{player.email}</TableCell>
                    </TableRow>
                  ))) : 
                  <TableRow><TableCell>No players yet</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="w-2/5">
            <h2 className="text-xl font-bold mb-2">Pending Player Join Requests</h2>
              <div className="max-h-80 overflow-y-auto">
              {(userTeam?.joinRequests?.length ? userTeam.joinRequests : [
                { email: "request@domain.com", name: "John Doe" },
                { email: "a@a.com", name: "Tyler" },
                { email: "b@b.com", name: "James" },
                { email: "c@c.com", name: "Lucy" },
                { email: "d@d.com", name: "Barbera" },
                { email: "e@e.com", name: "Hank" },
                { email: "f@f.com", name: "Louis" },
                { email: "g@g.com", name: "Kate" },
                { email: "h@h.com", name: "Cassie" },
                { email: "i@i.com", name: "Bob" },
                { email: "j@j.com", name: "Adam" },
                { email: "k@k.com", name: "Liz" },
                { email: "l@l.com", name: "Emmanuel" },
                { email: "r@r.com", name: "Robert" },
                { email: "n@n.com", name: "Mary" },
              ]).map((request) => (
                <div key={request.email} className="p-4 border mb-2 rounded">
                  <p>{request.name} ({request.email})</p>
                  <Button
                    disabled={actionLoading}
                    className="button mr-2"
                    onPress={() => handleAction(
                      // `/api/teams/${session.user.teamName}/accept`,
                      // "POST",
                      // { playerEmail: request.email },
                      // "Player added!"
                    )}
                  >
                    Accept
                  </Button>
                  <Button
                    disabled={actionLoading}
                    className="button"
                    onPress={() => handleAction(
                      // `/api/teams/${session.user.teamName}/deny`,
                      // "POST",
                      // { playerEmail: request.email },
                      // "Request denied."
                    )}
                  >
                    Deny
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );  
}
