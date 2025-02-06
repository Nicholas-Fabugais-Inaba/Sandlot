// app/api/users/register/route.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { mockUsers } from '../database'; // Mock storage

async function registerUser(email: string, password: string, accountType: "player" | "team", name?: string, teamName?: string, gender?: string) {
  const existingUser = mockUsers.find(user => user.email === email);
  if (existingUser) {
    throw new Error('Email is already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = Date.now().toString(); // Unique ID generation for both player and team

  if (accountType === 'team') {
    const teamId = `team-${userId}`; // Generate a unique team ID using userId
    const newTeam = { id: teamId, email, password: hashedPassword, teamName, accountType };
    mockUsers.push(newTeam);
    console.log('Team registered:', newTeam);
    return newTeam;
  } else if (accountType === 'player') {
    const newPlayer = { id: userId, email, password: hashedPassword, name, gender, accountType };
    mockUsers.push(newPlayer);
    console.log('Player registered:', newPlayer);
    return newPlayer;
  }

  throw new Error('Invalid account type');
}

export async function POST(req: Request) {
  try {
    const { email, password, accountType, name, teamName, gender } = await req.json();

    if (!email || !password || !accountType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (accountType === 'team' && !teamName) {
      return NextResponse.json({ error: 'Team name is required for team registration' }, { status: 400 });
    }

    if (accountType === 'player' && !name) {
      return NextResponse.json({ error: 'Name is required for player registration' }, { status: 400 });
    }

    if (accountType === 'player' && !gender) {
      return NextResponse.json({ error: 'Gender is required for player registration' }, { status: 400 });
    }

    const newUser = await registerUser(email, password, accountType, name, teamName, gender);
    return NextResponse.json({ message: 'Registration successful', user: newUser }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to register';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
