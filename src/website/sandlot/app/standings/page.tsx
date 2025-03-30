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

import getStandings from "@/app/functions/getStandings";
import getSeasonState from "@/app/functions/getSeasonState";
import OffseasonMessage from "@/app/no-season/OffseasonMessage";
import PreseasonMessage from "@/app/no-season/PresasonMessage";

import { title } from "@/components/primitives";
import "./StandingsPage.css";
import "../Global.css";

export default function StandingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [sortDescriptors, setSortDescriptors] = useState<
    Record<
      string,
      { column: keyof Team; direction: "ascending" | "descending" }
    >
  >({});
  const [teams, setTeams] = useState<Team[]>([]);
  const [seasonState, setSeasonState] = useState<any>();

  interface Team {
    name: string;
    wins: number;
    losses: number;
    ties: number;
    forfeits: number;
    differential: number;
    division: string;
  }

  useEffect(() => {
    const fetchStandings = async () => {
      let response = await getSeasonState();
      setSeasonState(response);
      try {
        setIsLoading(true); // Set loading to true before fetching
        if (response === "season") {
          const standings = await getStandings();
          console.log("STANDINGS", standings);
          setTeams(standings);
        }
        setIsLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error("Error fetching standings:", error);
        setIsLoading(false); // Ensure loading is set to false even if there's an error
      }
    };

    console.log("Entering initial useeffect");
    fetchStandings();
  }, []);

  // Extract unique divisions
  let uniqueDivisions = Array.from(
    new Set(teams.map((team) => team.division)),
  );
  uniqueDivisions = uniqueDivisions.sort((s1, s2) => s1.toLowerCase().localeCompare(s2.toLowerCase()));

  // Function to handle sorting within a division
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

  // If loading, show a global spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Spinner label="Loading Standings..." size="lg" />
      </div>
    );
  }
  
  if (seasonState === "offseason") {
    return <OffseasonMessage />;
  }
  else if (seasonState === "preseason") {
    return <PreseasonMessage />;
  }
  else {
    return (
      <div>
        <div className="pageHeader">
          <h1 className={title()}>Standings</h1>
        </div>

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
                  {[
                    "name",
                    "wins",
                    "losses",
                    "ties",
                    "forfeits",
                    "differential",
                  ].map((key) => (
                    <TableColumn key={key} allowsSorting>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </TableColumn>
                  ))}
                </TableHeader>
                <TableBody items={sortedTeams}>
                  {(item) => (
                    <TableRow key={item.name} className="py-2">
                      <TableCell className="py-2 column-name">
                        {item.name}
                      </TableCell>
                      <TableCell className="py-2 column-wins">
                        {item.wins}
                      </TableCell>
                      <TableCell className="py-2 column-losses">
                        {item.losses}
                      </TableCell>
                      <TableCell className="py-2 column-ties">
                        {item.ties}
                      </TableCell>
                      <TableCell className="py-2 column-forfeits">
                        {item.forfeits}
                      </TableCell>
                      <TableCell className="py-2 column-differential">
                        {item.differential}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          );
        })}
      </div>
    );
  }
}
