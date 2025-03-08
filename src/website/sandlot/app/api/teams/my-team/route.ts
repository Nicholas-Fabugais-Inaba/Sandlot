// app/api/teams/my-team/route.ts

import { NextResponse } from 'next/server';
import { mockTeams } from '../database';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const playerEmail = searchParams.get('email');

    if (!playerEmail) {
        return NextResponse.json({ error: 'Player email is required' }, { status: 400 });
    }

    // Correcting: Search for the team based on either player's email or the captain's email.
    const team = mockTeams.find(t => t.players.includes(playerEmail) || t.captainEmail === playerEmail);
    if (!team) {
        return NextResponse.json({ error: 'No team found' }, { status: 404 });
    }

    return NextResponse.json({ team }, { status: 200 });
}
