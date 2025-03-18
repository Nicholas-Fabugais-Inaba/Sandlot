// app/api/teams/[team-id]/accept/route.ts

import { NextResponse } from "next/server";

import { findTeamById } from "../../database";

export async function POST(req: Request) {
  const { teamId, playerEmail, captainEmail } = await req.json();

  const team = findTeamById(teamId);

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  if (team.captainEmail !== captainEmail) {
    return NextResponse.json(
      { error: "Only the captain can accept players" },
      { status: 403 },
    );
  }

  if (!team.joinRequests || !team.joinRequests.includes(playerEmail)) {
    return NextResponse.json(
      { error: "No join request from this player" },
      { status: 400 },
    );
  }

  team.joinRequests = team.joinRequests.filter(
    (email) => email !== playerEmail,
  );
  team.players.push(playerEmail);

  return NextResponse.json(
    { message: "Player accepted into team", team },
    { status: 200 },
  );
}
