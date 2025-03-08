// app/standings/page.tsx

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
import { title } from "@/components/primitives";
import { getSession} from 'next-auth/react'
import getStandings from "../functions/getStandings";
import './StandingsPage.css';


export default function StandingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [sortDescriptors, setSortDescriptors] = useState<Record<string, { column: keyof Team; direction: "ascending" | "descending" }>>({});
  const [teams, setTeams] = useState<Team[]>([]);

  interface Team {
    name: string;
    wins: number;
    losses: number;
    ties: number;
    forfeits: number;
    differential: number;
    division: string;
  }

  // let list = useAsyncList<Team>({
  //   async load({ signal }) {
  //     let res = await fetch("https://swapi.py4e.com/api/people/?search", { signal });
  //     let json = await res.json();

  //     setIsLoading(false);

  //     return {
  //       items: [
  //         { name: "Team A", wins: 10, losses: 2, ties: 1, forfeits: 0, differential: 20, division: "Division A" },
  //         { name: "Team B", wins: 8, losses: 4, ties: 2, forfeits: 0, differential: 15, division: "Division A" },
  //         { name: "Team C", wins: 10, losses: 2, ties: 1, forfeits: 0, differential: 20, division: "Division A" },
  //         { name: "Team D", wins: 8, losses: 4, ties: 2, forfeits: 0, differential: 15, division: "Division A" },
  //         { name: "Team E", wins: 6, losses: 6, ties: 1, forfeits: 1, differential: 5, division: "Division B" },
  //         { name: "Team F", wins: 4, losses: 8, ties: 0, forfeits: 1, differential: -10, division: "Division B" },
  //         { name: "Team G", wins: 6, losses: 6, ties: 1, forfeits: 1, differential: 5, division: "Division C" },
  //         { name: "Team H", wins: 4, losses: 8, ties: 0, forfeits: 1, differential: -10, division: "Division C" },
  //         { name: "Team I", wins: 6, losses: 6, ties: 1, forfeits: 1, differential: 5, division: "Division D" },
  //         { name: "Team J", wins: 4, losses: 8, ties: 0, forfeits: 1, differential: -10, division: "Division D" },
  //       ],
  //     };
  //   },
  // }); 
  
  useEffect(() => {
  
      (async () => {
        let standings = await getStandings()
        console.log(standings)
        console.log(standings[0])
        // console.log(list)
        setTeams(standings)
      })();
  
      setIsLoading(false); // Set loading to false after fetching session
  
    }, []);

  // Extract unique divisions
  const uniqueDivisions = Array.from(new Set(teams.map((team) => team.division)));

  // Function to handle sorting within a division
  const handleSort = (division: string, sortDescriptor: { column: keyof Team; direction: "ascending" | "descending" }) => {
    setSortDescriptors((prev) => ({
      ...prev,
      [division]: sortDescriptor, // Directly update the sortDescriptor state
    }));
  };  

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h1 className={title()}>Standings</h1>
      </div>

      {/* Render a separate table for each division */}
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
              return sortDescriptor.direction === "ascending" ? first.localeCompare(second) : second.localeCompare(first);
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
              sortDescriptor={sortDescriptors[division]} // Ensure correct state is used
              onSortChange={(sort) => handleSort(division, sort as { column: keyof Team; direction: "ascending" | "descending" })}
            >
              <TableHeader>
                {["name", "wins", "losses", "ties", "forfeits", "differential"].map((key) => (
                  <TableColumn key={key} allowsSorting>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </TableColumn>
                ))}
              </TableHeader>
              <TableBody isLoading={isLoading} items={sortedTeams} loadingContent={<Spinner label="Loading..." />}>
                {(item) => (
                  <TableRow key={item.name} className="py-2">
                    <TableCell className="py-2 column-name">{item.name}</TableCell>
                    <TableCell className="py-2 column-wins">{item.wins}</TableCell>
                    <TableCell className="py-2 column-losses">{item.losses}</TableCell>
                    <TableCell className="py-2 column-ties">{item.ties}</TableCell>
                    <TableCell className="py-2 column-forfeits">{item.forfeits}</TableCell>
                    <TableCell className="py-2 column-differential">{item.differential}</TableCell>
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
