// app/directory/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
} from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";

import { title } from "@/components/primitives";
// import getStandings from "../functions/getStandings";
import "./TeamDirectoryPage.css";
import getDirectoryTeams from "@/app/functions/getDirectoryTeams";
import getDirectoryPlayers from "@/app/functions/getDirectoryPlayers";

let notificationTimeout: NodeJS.Timeout | null = null; // Declare a variable to store the timeout

export default function TeamsDirectoryPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortDescriptors, setSortDescriptors] = useState<
    Record<
      string,
      { column: keyof Team; direction: "ascending" | "descending" }
    >
  >({});
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null); // State for selected team
  const [players, setPlayers] = useState<Player[]>([]);
  const [copyNotification, setCopyNotification] = useState<string | null>(null);

  interface Team {
    team_id: number;
    name: string;
    division: string;
  }

  interface Player {
    player_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    gender: string;
  }

  useEffect(() => {

    // fetches session info
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };
    
    fetchSession();

    // fetches teams info
    (async () => {
      let teams = await getDirectoryTeams();
      setTeams(teams);
    })();

  }, []);

  // Set loading to false after session is fetched and delay is complete
  useEffect(() => {
    const delayLoading = async () => {  
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
  
    delayLoading();
  }, [session]);

  const set_players_in_team = async (selected_team: Team) => {
    setSelectedTeam(selected_team); // Set the selected team
    let players_selected = await getDirectoryPlayers({team_id: selected_team.team_id});
    setPlayers(players_selected);
  };

  const uniqueDivisions = Array.from(
    new Set(teams.map((team) => team.division)),
  );

  const handleSort = (
    division: string,
    sortDescriptor: {
      column: keyof Team;
      direction: "ascending" | "descending";
    },
  ) => {
    setSortDescriptors((prev) => ({
      ...prev,
      [division]: sortDescriptor,
    }));
  };

 if (isLoading) {
    return <Spinner label="Loading..." />;
  }

  if (session?.user.role === "commissioner" || session?.user.role === "team") {
  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h1 className={title()}>Team Directory</h1>
      </div>

      <div style={{ display: "flex" }}>
        <div style={{ width: "50%" }}>
          {/* Render a separate table for each division */}
          {uniqueDivisions.map((division) => {
            const sortedTeams = [
              ...teams.filter((team) => team.division === division),
            ];
            const sortDescriptor = sortDescriptors[division];

            if (sortDescriptor) {
              sortedTeams.sort((a, b) => {
                let first = a[sortDescriptor.column];
                let second = b[sortDescriptor.column];

                if (typeof first === "number" && typeof second === "number") {
                  return sortDescriptor.direction === "ascending"
                    ? first - second
                    : second - first;
                }

                if (typeof first === "string" && typeof second === "string") {
                  return sortDescriptor.direction === "ascending"
                    ? first.localeCompare(second)
                    : second.localeCompare(first);
                }

                return 0;
              });
            }

            return (
              <div key={division} className="mb-6">
                <h2 className="text-xl font-bold text-left mb-2">{division}</h2>
                <Table
                  aria-label={`Standings for ${division}`}
                  classNames={{ table: "w-full" }}
                  sortDescriptor={sortDescriptors[division]}
                  onSortChange={(sort) =>
                    handleSort(
                      division,
                      sort as {
                        column: keyof Team;
                        direction: "ascending" | "descending";
                      },
                    )
                  }
                >
                  <TableHeader>
                    {["name"].map((key) => (
                      <TableColumn key={key} allowsSorting>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </TableColumn>
                    ))}
                  </TableHeader>
                  <TableBody
                    isLoading={isLoading}
                    items={sortedTeams}
                    loadingContent={<Spinner label="Loading..." />}
                  >
                    {(item) => (
                      <TableRow key={item.name} className="py-2">
                        <TableCell
                          className="py-2 column-name cursor-pointer text-white-600 hover:underline"
                          onClick={() => {
                            console.log("Selected team", item);
                            set_players_in_team(item); // Fetch players for the selected team
                          }}
                          title="Click to view team details"
                        >
                          {item.name}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            );
          })}
        </div>
        <div className="right-half">
          {/* Display selected team info */}
          <div className="right-box">
            {selectedTeam ? (
              <>
                <h2 className="text-xl font-bold mb-2">
                  {selectedTeam.name}
                </h2>
                <p className="mt-4">
                  <strong>Division:</strong> {selectedTeam.division}
                </p>
                <div className="mt-4">
                  <strong>Players:</strong>
                  {players.length > 0 ? (
                    <ul className="mt-2">
                    {players.map((player) => (
                      <li key={player.player_id} className="mb-2">
                        <div>{player.first_name} {player.last_name}</div>
                        {session?.user.role === "commissioner" && (
                          <>
                            <div
                              className="ml-4 cursor-pointer text-white-600 hover:underline"
                              onClick={() => {
                                navigator.clipboard.writeText(player.email);
                                setCopyNotification("Email copied to clipboard!");

                                // Clear the existing timeout if it exists
                                if (notificationTimeout) {
                                  clearTimeout(notificationTimeout);
                                }

                                // Set a new timeout
                                notificationTimeout = setTimeout(() => {
                                  setCopyNotification(null);
                                  notificationTimeout = null; // Reset the timeout variable
                                }, 2000); // Clear notification after 2 seconds
                              }}
                              title="Click to copy email to clipboard"
                            >
                              {player.email}
                            </div>
                            <div className="ml-4">{player.phone_number}</div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                  ) : (
                    <p>No players found for this team.</p>
                  )}
                </div>
                {/* Add more team details here if available */}
              </>
            ) : (
              <p>Select a team to view details</p>
            )}

            {copyNotification && (
              <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
                {copyNotification}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )}

  else { return <h1>Unauthorized</h1> }
}