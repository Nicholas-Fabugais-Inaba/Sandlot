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

export default function TeamPage() {
  const [isLoading, setIsLoading] = React.useState(true);

  interface Team {
    name: string;
    games_played: number;
    hits: number;
    runs: number;
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
        <h1 className={title()}>Team</h1>
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
              Roster
            </TableColumn>
            <TableColumn key="games_played" allowsSorting>
              GP
            </TableColumn>
            <TableColumn key="hits" allowsSorting>
              Hits
            </TableColumn>
            <TableColumn key="runs" allowsSorting>
              Runs
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
