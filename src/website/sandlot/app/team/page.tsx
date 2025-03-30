// app/team/page.tsx

"use client";

import { join } from "path";

import React, { useEffect, useState, useCallback } from "react";
import {
  Input,
  Modal,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { user } from "@heroui/theme";

import getTeamInfo from "../functions/getTeamInfo";

// join request queries
import createJR from "../functions/createJR";
import getJR from "../functions/getJR";
import acceptJR from "../functions/acceptJR";
import declineJR from "../functions/declineJR";

import { title } from "@/components/primitives";
// import { useGlobalState } from "@/context/GlobalStateContext";
import AvailableTeams from "./AvailableTeams";

import "../Global.css";
import "./TeamPage.css";
import getDirectoryTeams from "../functions/getDirectoryTeams";
import getPlayerActiveTeam from "../functions/getPlayerActiveTeam";
import updateCaptainStatus from "../functions/updateCaptainStatus";
import leaveTeam from "../functions/leaveTeam";
import getTeamAccountData from "../functions/getTeamAccountData";

interface JoinRequest {
  id: number;
  player_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: string;
}

interface Team {
  id: number;
  name: string;
  division: string;
  // captain_id: number;
  // players: { id: string; name: string; email: string }[];
  // joinRequests: { id: number; first_name: string; last_name: string, email: string }[];
  // captain: { id: string; name: string; email: string }; // Add captain info
}

interface Player {
  player_id: number;
  captain: boolean;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: string;
}

export default function TeamPage() {
  const [session, setSession] = useState<Session | null>(null);
  // const [teams, setTeams] = useState<Team[]>([]);
  const [roster, setRoster] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();
  // const { teamId, teamName } = useGlobalState();
  const [teamId, setTeamId] = useState<number>(0);
  const [teamName, setTeamName] = useState<string>("team_name");

  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);

  useEffect(() => {
    const initializeStates = async () => {
      try {
        const session = await getSession();
        setSession(session);
        
        if (!session || (session?.user.role !== "team" && session?.user.role !== "player")) {
          router.push("/");
          return;
        } else {
  
          let teamId = 0;
          let teamName = "team_name";
    
          // Check the role and fetch the appropriate data
          if (session && session.user.role === "player") {
            try {
              const teamData = await getPlayerActiveTeam(session?.user.id);
              teamId = teamData.team_id;
              teamName = teamData.team_name;
            } catch (error) {
              console.error("Error fetching player active team:", error);
              // If error occurs, set team name to "No team assigned"
              teamName = "No team assigned";
            }
          } else if (session && session.user.role === "team") {
            const accountData = await getTeamAccountData(session.user.id);
            teamId = session.user.id;
            teamName = accountData.teamName;
          }
    
          // Set teamId and teamName
          setTeamId(teamId);
          setTeamName(teamName);
    
          // Fetch team info
          try {
            let teamInfo = await getTeamInfo({ team_id: teamId });
            setRoster(teamInfo);
          } catch (error) {
            console.error("Error fetching team info:", error);
            setRoster([]); // Gracefully handle the error and set an empty roster
          }
    
          // Fetch join requests
          try {
            let requests = await getJR({ team_id: teamId });
            setJoinRequests(requests);
          } catch (error) {
            console.error("Error fetching join requests:", error);
            setJoinRequests([]); // Gracefully handle the error and set empty join requests
          }
    
          setLoading(false);
      }
      
      } catch (error) {
        console.error("Error during session initialization:", error);
        setLoading(false); // Ensure loading is stopped in case of any error
      }
      
    };
  
    initializeStates();
  }, []);  

  const changeCaptainStatus = async (playerId: number, promotion: boolean) => {
    setActionLoading(true);

    let rosterCopy = [...roster]
    for(let i = 0; i < rosterCopy.length; i++) {
      if(rosterCopy[i].player_id == playerId) {
        rosterCopy[i].captain = promotion
      }
    }
    setRoster(rosterCopy)

    await updateCaptainStatus({ team_id: teamId, player_id: playerId, captain: promotion });

    setActionLoading(false);
    // Update the team info and roster
    setTimeout(async() => {
      const updatedTeamInfo = await getTeamInfo({ team_id: teamId });
      setRoster(updatedTeamInfo);
    }, 1000)
  };

  // TODO: update client session with these changes and test cases
  const handleLeaveTeam = async (playerId: number) => {
    if(teamId == session?.user.team_id) {
      let teams = Object.keys(session?.user.teams)
      if(teams.length > 1) {
        teams = teams.filter(team => Number(team) !== teamId)
        await leaveTeam({team_id: teamId, player_id: playerId, new_active_team_required: true, new_active_team: teams[0]})
      }
      else {
        await leaveTeam({team_id: teamId, player_id: playerId, new_active_team_required: true, new_active_team: null})
      }
    }
    else {
      await leaveTeam({team_id: teamId, player_id: playerId, new_active_team_required: false, new_active_team: null})
    }
    window.location.reload();
    router.push('/join-a-team')
  }

  const handleRequestJoin = async (teamId: number) => {
    if (session) {
      createJR({
        email: session.user.email,
        team_id: teamId
      })
    }
  }

  const handleAction = async () => {};

  // Loading spinner when data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Spinner label="Loading Team Information..." size="lg" />
      </div>
    );
  }

  return (
    <div className="pageHeader">
      <h1 className={title()}>
        Team
      </h1>

      {/* Player View: Available Teams */}
      {session?.user.role === "player" && !teamId ? (
        <AvailableTeams />
      ) : session?.user.role === "player" && teamId ? (
        // Player View After Join Request Accepted
        <div className="flex">
          <div className="w-3/5 mr-4">
            <h2 className="text-xl font-bold mb-2">
              {teamName || "Your Team"} Roster
            </h2>
            <div className="max-h-[calc(100vh-180px)] overflow-y-auto p-2"> {/* Added scrollable container */}
            <Table
                aria-label="Team Roster"
                classNames={{ table: "min-w-full" }}>
                <TableHeader>
                  {["name", "contact", "phone number"].map((key) => (
                    <TableColumn key={key} allowsSorting>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </TableColumn>
                  ))}
                </TableHeader>
                <TableBody>
                  {roster.map((player, index) => (
                      <TableRow key={index}>
                        <TableCell className="py-2 column-name flex items-center gap-3">
                          {player.first_name + " " + player.last_name}
                          {player.captain ? 
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 26 26">
                              <title>Captain</title>
                              <path fill="currentColor" d="M25.326 10.137a1.001 1.001 0 0 0-.807-.68l-7.34-1.066l-3.283-6.651c-.337-.683-1.456-.683-1.793 0L8.82 8.391L1.48 9.457a1 1 0 0 0-.554 1.705l5.312 5.178l-1.254 7.31a1.001 1.001 0 0 0 1.451 1.054L13 21.252l6.564 3.451a1 1 0 0 0 1.451-1.054l-1.254-7.31l5.312-5.178a.998.998 0 0 0 .253-1.024z"/>
                            </svg>
                          : null}
                        </TableCell>
                        <TableCell className="py-2 column-contact">
                          {player.email}
                        </TableCell>
                        <TableCell>
                          {player.phone_number}
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Right Section: Team Info (Captain's Info and Leave Team) */}
          <div className="w-2/5">
            {/* <h2 className="text-xl font-bold mb-2">
              {teamName} Info
            </h2>
            <div className="flex flex-col items-center space-y-4">
              <Button
                className="button min-w-[160px]" // Made full width for consistency
                onPress={() =>
                  alert(
                    `Captain's Info: ${"Temp captain name"} (${"Temp captain contact"})`,
                  )
                }
              >
                Captain's Info
              </Button>
            </div> */}
            <h2 className="text-xl font-bold mt-4 mb-2">
              Player Actions
            </h2>
            <div className="flex flex-col items-center space-y-4">
              <Button
                className="button min-w-[160px]"
                onPress={() => router.push('/join-a-team')} // Join New Team action
              >
                Join New Team
              </Button>
              <Button
                className="button min-w-[160px]" // Made full width for consistency
                onPress={() => handleLeaveTeam(session.user.id)}
              >
                Leave Team
              </Button>
            </div>
          </div>
        </div>
      ) : session?.user.role === "team" ? (
        // Team View: Team Roster and Pending Requests
        <div className="flex">
          <div className="w-3/5 mr-4">
            <h2 className="text-xl font-bold mb-2">
              {teamName || "Your Team"} Roster
            </h2>
            <div className="max-h-[calc(100vh-180px)] overflow-y-auto p-2">
              <Table
                aria-label="Team Roster"
                classNames={{ table: "min-w-full" }}
              >
                <TableHeader>
                  {["name", "contact", "phone number","action"].map((key) => (
                    <TableColumn key={key} allowsSorting>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </TableColumn>
                  ))}
                </TableHeader>
                <TableBody>
                  {roster ? (
                    roster.map((player, index) => (
                      <TableRow key={index}>
                        <TableCell className="py-2 column-name">
                          {player.first_name + " " + player.last_name}
                        </TableCell>
                        <TableCell className="py-2 column-contact">
                          {player.email}
                        </TableCell>
                        <TableCell>
                          {player.phone_number}
                        </TableCell>
                        <TableCell className="w-[220px]">
                          {player.captain ? (
                            <Button
                              className="w-25 min-w-[160px] h-8 text-sm square-full bg-[#eaeaec] text-black dark:bg-[#27272A] dark:text-gray-200 hover:bg-[#f0f0f3] dark:hover:bg-[#3F3F46] transition"
                              disabled={actionLoading}
                              onPress={() => changeCaptainStatus(player.player_id, false)}
                            >
                              Move to Player
                            </Button>
                          ) : (
                            <Button
                              className="w-25 h-8 text-sm square-full bg-[#EaEaEc] text-black dark:bg-[#27272A] dark:text-gray-200 hover:bg-[#F0F0F3] dark:hover:bg-[#3F3F46] transition"
                              disabled={actionLoading}
                              onPress={() => changeCaptainStatus(player.player_id,true)}
                            >
                              Promote to Captain
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell>No players yet</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="w-2/5">
            <h2 className="text-xl font-bold mb-2">
              Pending Player Join Requests
            </h2>
            <div className="max-h-80 overflow-y-auto">
              {joinRequests ? (
                joinRequests.map((request) => (
                  <div key={request.email} className="p-4 border mb-2 rounded">
                    <p>
                      {request.first_name + " " + request.last_name} (
                      {request.email})
                    </p>
                    <Button
                      className="button mr-2"
                      disabled={actionLoading}
                      onPress={async () => {
                        await acceptJR({
                          jr_id: request.id,
                          player_id: request.player_id,
                          team_id: teamId,
                        });
                        setJoinRequests(
                          joinRequests.filter((req) => req.id != request.id),
                        );
                        setRoster([
                          ...roster,
                          {
                            player_id: request.player_id,
                            captain: false,
                            first_name: request.first_name,
                            last_name: request.last_name,
                            email: request.email,
                            phone_number: request.phone_number,
                            gender: request.gender,
                          },
                        ]);
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      className="button"
                      disabled={actionLoading}
                      onPress={async () => {
                        await declineJR({ jr_id: request.id });
                        setJoinRequests(
                          joinRequests.filter((req) => req.id != request.id),
                        );
                      }}
                    >
                      Deny
                    </Button>
                  </div>
                ))
              ) : (
                <p>No pending requests</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
