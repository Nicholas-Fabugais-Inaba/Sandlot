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

interface JoinRequest {
  id: number;
  player_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: string;
}

// Define the interface for Team and User data
interface Team {
  id: number;
  team_name: string;
  captain_id: number;
  // players: { id: string; name: string; email: string }[];
  // joinRequests: { id: number; first_name: string; last_name: string, email: string }[];
  // captain: { id: string; name: string; email: string }; // Add captain info
}

interface Player {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: string;
}

export default function TeamPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [roster, setRoster] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>("");
  const [userTeamID, setUserTeamID] = useState<number | null>(null);

  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  // const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const initializeStates = async () => {
      const session = await getSession();

      setSession(session);
      let teamInfo = await getTeamInfo({ team_id: session?.user.team_id });

      setRoster(teamInfo);
      let requests = await getJR({ team_id: session?.user.team_id });

      setJoinRequests(requests);

      setLoading(false);
    };

    initializeStates();
  }, []);

  const handleAction = async () => {};

  return (
    <div>
      <h1 className={title()}>Team</h1>

      {/* Player View: Available Teams */}
      {session?.user.role === "player" && !session.user.team_id ? (
        <div>
          <h2 className="text-xl font-semibold text-center mb-4 mt-4">
            Available Teams
          </h2>
          {teams.length ? (
            teams.map((team) => (
              <div key={team.id} className="p-4 border mb-2 rounded">
                <p>{team.team_name}</p>
                <Button
                  className="button"
                  disabled={actionLoading}
                  onPress={
                    () => handleAction()
                    // `/api/teams/${team.id}/join`,
                    // "POST",
                    // { playerEmail: session.user.email },
                    // "Join request sent!"
                  }
                >
                  Request to Join
                </Button>
              </div>
            ))
          ) : (
            <p>No available teams at the moment.</p>
          )}
        </div>
      ) : session?.user.role === "player" && session.user.team_id ? (
        // Player View After Join Request Accepted
        <div className="flex">
          {/* Left Section: Team Roster */}
          <div className="w-3/5 mr-4">
            <h2 className="text-xl font-bold mb-2">
              {session?.user.teamName} Roster
            </h2>
            <Table
              aria-label="Team Roster"
              classNames={{ table: "min-w-full" }}
            >
              <TableHeader>
                <TableColumn>Name</TableColumn>
              </TableHeader>
              <TableBody>
                {roster.length ? (
                  roster.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>
                        {player.first_name + " " + player.last_name}
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

          {/* Right Section: Team Info (Captain's Info and Leave Team) */}
          <div className="w-2/5">
            <h2 className="text-xl font-bold mb-2">
              {session?.user.teamName}'s Info
            </h2>
            <Button
              className="button mb-4"
              onPress={() =>
                alert(
                  `Captain's Info: ${"Temp captain name"} (${"Temp captain contact"})`,
                )
              }
            >
              Captain's Info
            </Button>
            <Button
              className="button"
              onPress={
                () => handleAction()
                // `/api/teams/${userTeam.id}/leave`,
                // "POST",
                // { playerEmail: session.user.email },
                // "You have left the team"
              }
            >
              Leave Team
            </Button>
          </div>
        </div>
      ) : session?.user.role === "team" ? (
        // Team View: Team Roster and Pending Requests
        <div className="flex">
          <div className="w-3/5 mr-4">
            <h2 className="text-xl font-bold mb-2">
              {session?.user.teamName || "Your Team"} Roster
            </h2>
            <div className="max-h-80 overflow-y-auto p-2">
              <Table
                aria-label="Team Roster"
                classNames={{ table: "min-w-full" }}
              >
                <TableHeader>
                  {["name", "contact"].map((key) => (
                    <TableColumn key={key} allowsSorting>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </TableColumn>
                  ))}
                </TableHeader>
                <TableBody>
                  {roster ? (
                    roster.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell className="py-2 column-name">
                          {player.first_name + " " + player.last_name}
                        </TableCell>
                        <TableCell className="py-2 column-contact">
                          {player.email}
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
                          team_id: session?.user.team_id,
                        });
                        setJoinRequests(
                          joinRequests.filter((req) => req.id != request.id),
                        );
                        setRoster([
                          ...roster,
                          {
                            id: request.player_id,
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
                // TODO: this does not show up properly if there are no requests
                <p>No pending requests</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
