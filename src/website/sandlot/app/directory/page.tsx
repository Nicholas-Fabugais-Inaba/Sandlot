"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";

import { ChevronDown, ChevronRight } from "lucide-react";

import { title } from "@/components/primitives";
import getDirectoryTeams from "@/app/functions/getDirectoryTeams";
import getDirectoryPlayers from "@/app/functions/getDirectoryPlayers";

let notificationTimeout: NodeJS.Timeout | null = null;

export default function TeamsDirectoryPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [sortDescriptors, setSortDescriptors] = useState<
    Record<string, { column: keyof Team; direction: "ascending" | "descending" }>
  >({});
  const [teams, setTeams] = useState<Team[]>([]);
  const [expandedTeams, setExpandedTeams] = useState<string[]>([]); 
  const [playersByTeam, setPlayersByTeam] = useState<Record<string, Player[]>>({}); 
  const [copyNotification, setCopyNotification] = useState<string | null>(null);

  interface Team {
    team_id: number;
    name: string;
    division: string;
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

  useEffect(() => {
    const fetchSessionAndData = async () => {
      const session = await getSession();
      setSession(session);

      const teams = await getDirectoryTeams();
      setTeams(teams);

      // Fetch players for all teams
      const playersData = await Promise.all(
        teams.map(async (team: Team) => {
          const players = await getDirectoryPlayers({ team_id: team.team_id });
          return { teamName: team.name, players };
        })
      );

      // Map players to their respective teams
      const playersByTeamData = playersData.reduce((acc, { teamName, players }) => {
        acc[teamName] = players;
        return acc;
      }, {} as Record<string, Player[]>);

      setPlayersByTeam(playersByTeamData);
      setIsLoading(false); // Set loading to false after all data is fetched
    };

    fetchSessionAndData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

const toggleTeamDropdown = (team: Team) => {
  if (expandedTeams.includes(team.name)) {
    // Collapse the team
    setExpandedTeams(expandedTeams.filter((name) => name !== team.name));
  } else {
    // Expand the team
    setExpandedTeams([...expandedTeams, team.name]);
  }
};

  const uniqueDivisions = Array.from(new Set(teams.map((team) => team.division)));

  const handleSort = (
    division: string,
    sortDescriptor: { column: keyof Team; direction: "ascending" | "descending" }
  ) => {
    setSortDescriptors((prev) => ({
      ...prev,
      [division]: sortDescriptor,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Spinner label="Loading Team Directory..." size="lg" />
      </div>
    );
  }

  if (session?.user.role === "commissioner" || session?.user.role === "team") {
    return (
      <div>
        <div style={{ marginBottom: "20px" }}>
          <h1 className={title()}>Team Directory</h1>
        </div>

        <div style={{ width: "100%" }}>
          {uniqueDivisions.map((division) => {
            const sortedTeams = [...teams.filter((team) => team.division === division)];
            const sortDescriptor = sortDescriptors[division];

            if (sortDescriptor) {
              sortedTeams.sort((a, b) => {
                let first = a[sortDescriptor.column];
                let second = b[sortDescriptor.column];

                if (typeof first === "number" && typeof second === "number") {
                  return sortDescriptor.direction === "ascending" ? first - second : second - first;
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
                  color="primary"
                  selectionMode="none"
                  onSortChange={(sort) =>
                    handleSort(
                      division,
                      sort as { column: keyof Team; direction: "ascending" | "descending" }
                    )
                  }
                >
                  <TableHeader>
                    <TableColumn key="name" allowsSorting>Name</TableColumn>
                  </TableHeader>
                  <TableBody isLoading={isLoading} items={sortedTeams} loadingContent={<Spinner label="Loading..." />}>
                    {sortedTeams.map((team) => (
                      <React.Fragment key={team.name}>
                        <TableRow className="py-2 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700">
                          <TableCell
                            className="py-2 column-name cursor-pointer text-black dark:text-white hover:underline flex items-center"
                            onClick={() => toggleTeamDropdown(team)}
                            title="Click to view team details"
                          >
                            {expandedTeams.includes(team.name) ? (
                              <ChevronDown className="mr-2 text-gray-400 w-4 h-4" />
                            ) : (
                              <ChevronRight className="mr-2 text-gray-400 w-4 h-4" />
                            )}
                            {team.name}
                          </TableCell>
                        </TableRow>

                        {expandedTeams.includes(team.name) && (
                          <TableRow>
                            <TableCell colSpan={1}>
                              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                                <strong>Players:</strong>
                                {playersByTeam[team.name]?.length > 0 ? (
                                  <ul className="mt-2">
                                  {playersByTeam[team.name].map((player) => (
                                    <li key={player.player_id} className="mb-2">
                                      <div className="flex items-center">
                                        {/* Player Name */}
                                        <span>
                                          {player.first_name} {player.last_name}
                                        </span>
                                
                                        {/* Captain Icon */}
                                        {player.captain && (
                                          <span className="ml-2" title="Captain">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="10"
                                              height="10"
                                              viewBox="0 0 26 26"
                                              fill="currentColor"
                                            >
                                              <title>Captain</title>
                                              <path d="M25.326 10.137a1.001 1.001 0 0 0-.807-.68l-7.34-1.066l-3.283-6.651c-.337-.683-1.456-.683-1.793 0L8.82 8.391L1.48 9.457a1 1 0 0 0-.554 1.705l5.312 5.178l-1.254 7.31a1.001 1.001 0 0 0 1.451 1.054L13 21.252l6.564 3.451a1 1 0 0 0 1.451-1.054l-1.254-7.31l5.312-5.178a.998.998 0 0 0 .253-1.024z" />
                                            </svg>
                                          </span>
                                        )}
                                      </div>
                                
                                      {/* Email and Phone Number */}
                                      {(session?.user.role === "commissioner" ||
                                        (session?.user.role === "team" && player.captain)) && (
                                        <div className="ml-4">
                                          <div
                                            className="cursor-pointer text-blue-600 hover:underline inline-block"
                                            onClick={() => {
                                              navigator.clipboard.writeText(player.email);
                                              setCopyNotification("Email copied to clipboard!");
                                              if (notificationTimeout) clearTimeout(notificationTimeout);
                                              notificationTimeout = setTimeout(() => setCopyNotification(null), 2000);
                                            }}
                                            title="Click to copy email to clipboard"
                                          >
                                            {player.email}
                                          </div>
                                          <div>{player.phone_number}</div>
                                        </div>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                                ) : (
                                  <p>No players found for this team.</p>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            );
          })}
        </div>

        {copyNotification && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
            {copyNotification}
          </div>
        )}

        {showScrollToTop && (
          <button
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-3 bg-blue-500 text-white rounded-full shadow-lg z-50"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            ↑
          </button>
        )}
      </div>
    );
  } else {
    return <h1>Unauthorized</h1>;
  }
}