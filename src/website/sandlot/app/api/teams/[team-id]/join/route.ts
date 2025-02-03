// app/api/teams/[team-id]/join/route.ts

import { NextResponse } from 'next/server';
import { findTeamById } from '../../database';

export async function POST(req: Request) {
  const { teamId, playerEmail } = await req.json();

  const team = findTeamById(teamId);
  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }

  if (team.players.includes(playerEmail)) {
    return NextResponse.json({ error: 'Player already in team' }, { status: 400 });
  }

  if (team.joinRequests.includes(playerEmail)) {
    return NextResponse.json({ error: 'Join request already sent' }, { status: 400 });
  }

  team.joinRequests.push(playerEmail);
  return NextResponse.json({ message: 'Join request sent', team }, { status: 200 });
}
