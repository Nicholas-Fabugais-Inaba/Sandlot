// app/api/teams/create/route.ts

import { NextResponse } from "next/server";

import { mockTeams } from "../database";

// This function is used to programmatically create a team from another module
export async function createTeam({
  teamName,
  captainEmail,
}: {
  teamName: string;
  captainEmail: string;
}) {
  if (!teamName || !captainEmail) {
    throw new Error("Missing required fields for team creation");
  }

  const teamId = `team-${Date.now()}`;
  const newTeam = {
    id: teamId,
    teamName,
    captainEmail,
    players: [],
    joinRequests: [],
  };

  mockTeams.push(newTeam);

  return newTeam; // Return the newly created team object
}

export async function POST(req: Request) {
  try {
    const { teamName, captainEmail } = await req.json();

    if (!teamName || !captainEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const team = await createTeam({ teamName, captainEmail });

    return NextResponse.json(
      { message: "Team created successfully", team },
      { status: 201 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create team";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
