// app/api/teams/[team-id]/join/route.ts

import { NextResponse } from "next/server";

import { findTeamById } from "../../database"; // Keeps team-related data
import { findUserByEmail, findUserByName } from "../../../users/database"; // Import user lookup function

export async function POST(req: Request) {
  const url = new URL(req.url);
  const teamId = url.pathname.split("/")[3];

  if (!teamId) {
    return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
  }

  const { playerEmail, playerName } = await req.json();

  const team = findTeamById(teamId);

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  // Check if the player is already in the team
  if (team.players.includes(playerEmail)) {
    return NextResponse.json(
      { error: "Player already in team" },
      { status: 400 },
    );
  }

  // Check if the join request has already been sent
  if (
    team.joinRequests.some(
      (request) => request.email === playerEmail && request.name === playerName,
    )
  ) {
    return NextResponse.json(
      { error: "Join request already sent" },
      { status: 400 },
    );
  }

  // Fetch the user's email
  const userEmail = findUserByEmail(playerEmail);

  if (!userEmail) {
    return NextResponse.json(
      { error: "User's email not found" },
      { status: 404 },
    );
  }

  // Fetch the user's name
  const userName = findUserByName(playerName);

  if (!userName) {
    return NextResponse.json(
      { error: "User's name not found" },
      { status: 404 },
    );
  }

  // Add the join request
  team.joinRequests.push({ email: playerEmail, name: playerName });

  return NextResponse.json(
    { message: "Join request sent", team },
    { status: 200 },
  );
}
