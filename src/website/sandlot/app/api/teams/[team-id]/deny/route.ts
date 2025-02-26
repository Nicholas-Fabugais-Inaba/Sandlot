// app/api/teams/[team-id]/deny/route.ts

import { NextResponse } from "next/server";
import { findTeamById, updateTeam } from "../../database";

export async function POST(req: Request) {
  const { teamId, playerEmail, captainEmail } = await req.json();

  const team = await findTeamById(teamId);
  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  if (team.captainEmail !== captainEmail) {
    return NextResponse.json({ error: "Only the captain can deny players" }, { status: 403 });
  }

  team.joinRequests = team.joinRequests.filter((email) => email !== playerEmail);

  // Ensure the updated team is saved
  await updateTeam(teamId, { joinRequests: team.joinRequests });

  return NextResponse.json({ message: "Player request denied", team }, { status: 200 });
}
