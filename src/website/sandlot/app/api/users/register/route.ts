// api/users/register.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

let mockUsers: { id: string; email: string; password: string }[] = [];

async function registerUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now().toString(), email, password: hashedPassword };
  mockUsers.push(newUser);  // Add to mock user array
  console.log('User registered:', newUser);
  return newUser;
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Register the user and add to mock DB
    const newUser = await registerUser(email, password);

    return NextResponse.json({ message: 'Registration successful', user: newUser }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to register';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
