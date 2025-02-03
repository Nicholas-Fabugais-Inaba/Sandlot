// app/standings/page.tsx

"use client";

import React from "react";
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

export default function StandingsPage() {
  const [isLoading, setIsLoading] = React.useState(true);

  interface Team {
    name: string;
    wins: number;
    losses: number;
    ties: number;
    forfeits: number;
    differential: number;
    division: string; // 🆕 Added division field
  }

  let list = useAsyncList<Team>({
    async load({ signal }) {
      let res = await fetch("https://swapi.py4e.com/api/people/?search", {
        signal,
      });
      let json = await res.json();

      setIsLoading(false);

      // Mock Data (Replace this with actual fetched data)
      return {
        items: [
          { name: "Team A", wins: 10, losses: 2, ties: 1, forfeits: 0, differential: 20, division: "Division A" },
          { name: "Team B", wins: 8, losses: 4, ties: 2, forfeits: 0, differential: 15, division: "Division A" },
          { name: "Team C", wins: 10, losses: 2, ties: 1, forfeits: 0, differential: 20, division: "Division A" },
          { name: "Team D", wins: 8, losses: 4, ties: 2, forfeits: 0, differential: 15, division: "Division A" },
          { name: "Team E", wins: 6, losses: 6, ties: 1, forfeits: 1, differential: 5, division: "Division B" },
          { name: "Team F", wins: 4, losses: 8, ties: 0, forfeits: 1, differential: -10, division: "Division B" },
        ],
      };
    },
  });

  // 🆕 Extract unique divisions
  const uniqueDivisions = Array.from(new Set(list.items.map((team) => team.division)));

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h1 className={title()}>Standings</h1>
      </div>

      {/* 🆕 Render a separate table for each division */}
      {uniqueDivisions.map((division) => (
        <div key={division} className="mb-6">
          <h2 className="text-xl font-bold text-left mb-2">{division}</h2>
          <Table
            aria-label={`Standings for ${division}`}
            classNames={{ table: "w-full" }}
          >
            <TableHeader>
              <TableColumn key="name" allowsSorting>Name</TableColumn>
              <TableColumn key="wins" allowsSorting>Wins</TableColumn>
              <TableColumn key="losses" allowsSorting>Losses</TableColumn>
              <TableColumn key="ties" allowsSorting>Ties</TableColumn>
              <TableColumn key="forfeits" allowsSorting>Forfeits</TableColumn>
              <TableColumn key="differential" allowsSorting>Diff</TableColumn>
            </TableHeader>
            <TableBody
              isLoading={isLoading}
              items={list.items.filter((team) => team.division === division)}
              loadingContent={<Spinner label="Loading..." />}
            >
              {(item) => (
                <TableRow key={item.name} className="py-2">
                  <TableCell className="py-2">{item.name}</TableCell>
                  <TableCell className="py-2">{item.wins}</TableCell>
                  <TableCell className="py-2">{item.losses}</TableCell>
                  <TableCell className="py-2">{item.ties}</TableCell>
                  <TableCell className="py-2">{item.forfeits}</TableCell>
                  <TableCell className="py-2">{item.differential}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}
