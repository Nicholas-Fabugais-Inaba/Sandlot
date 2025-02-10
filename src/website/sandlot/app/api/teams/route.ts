// app/api/teams/route.ts

import { NextResponse } from 'next/server';
import { mockTeams } from './database';

export async function GET() {
  return NextResponse.json({ teams: mockTeams });
}
