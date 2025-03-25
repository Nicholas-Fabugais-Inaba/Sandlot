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
      
      console.log(teams);
      console.log(teams[0]);
      setTeams(teams);
    })();

  }, []);

  useEffect(() => {
    setIsLoading(false);  // Set loading to false after fetching session
  }, [teams]);

  const set_players_in_team = async (selected_team: Team) => {
    console.log("Selected team", selected_team);
    setSelectedTeam(selected_team); // Set the selected team
    console.log("HELLOWORLD", selected_team.team_id)
    let players_selected = await getDirectoryPlayers({team_id: selected_team.team_id});
    console.log("PLAYERS", players_selected);
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

 if (isLoading || !session) {
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
                <p>
                  <strong>Division:</strong> {selectedTeam.division}
                </p>
                <div>
                  <strong>Players:</strong> 
                  <ul>
                    {players.map((player) => (
                      <li key={player.player_id}>{player.first_name}</li>
                    ))}
                  </ul>
                </div>
                {/* Add more team details here if available */}
              </>
            ) : (
              <p>Select a team to view details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )}

  else { return <h1>Unauthorized</h1> }
}