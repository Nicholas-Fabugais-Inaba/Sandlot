// app/api/teams/create/route.ts

import { NextResponse } from 'next/server';
import { mockTeams } from '../database';

export async function POST(req: Request) {
  const { teamName, captainEmail } = await req.json();

  if (!teamName || !captainEmail) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const teamId = `team-${Date.now()}`;
  const newTeam = { id: teamId, teamName, captainEmail, players: [], joinRequests: [] };
  mockTeams.push(newTeam);

  return NextResponse.json({ message: 'Team created successfully', team: newTeam }, { status: 201 });
}
