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
import {useAsyncList} from "@react-stately/data";
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
  }

  let list = useAsyncList<Team>({
    async load({signal}) {
      let res = await fetch("https://swapi.py4e.com/api/people/?search", {
        signal,
      });
      let json = await res.json();

      setIsLoading(false);

      return {
        items: json.results,
      };
    },
    async sort({items, sortDescriptor}) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column as keyof Team];
          let second = b[sortDescriptor.column as keyof Team];
          let cmp = (parseInt(first as string) || first) < (parseInt(second as string) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h1 className={title()}>Standings</h1>
      </div>
      <div>
        <Table
          aria-label="Example table with client side sorting"
          classNames={{
            table: "min-h-[400px] w-full",
          }}
          sortDescriptor={list.sortDescriptor}
          onSortChange={list.sort}
        >
          <TableHeader>
            <TableColumn key="name" allowsSorting>
              Name
            </TableColumn>
            <TableColumn key="wins" allowsSorting>
              Wins
            </TableColumn>
            <TableColumn key="losses" allowsSorting>
              Losses
            </TableColumn>
            <TableColumn key="ties" allowsSorting>
              Ties
            </TableColumn>
            <TableColumn key="forfeits" allowsSorting>
              Forfeits
            </TableColumn>
            <TableColumn key="differential" allowsSorting>
              Diff
            </TableColumn>
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            items={list.items}
            loadingContent={<Spinner label="Loading..." />}
          >
            {(item) => (
              <TableRow key={item.name}>
                {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
