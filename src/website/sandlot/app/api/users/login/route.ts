// app/api/users/login/route.ts

import bcrypt from 'bcrypt';
import { mockUsers } from '../database';  // Use shared array
import { NextRequest, NextResponse } from 'next/server';

export async function authenticateUser(email: string, password: string) {
  const user = mockUsers.find((user) => user.email === email);

  if (user && (await bcrypt.compare(password, user.password))) {
    return { id: user.id, name: 'John Doe', email: user.email };
  }
  return null;
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Authenticate the user
  const user = await authenticateUser(email, password);

  if (user) {
    // Create session or token here (e.g., with NextAuth.js or custom solution)
    return NextResponse.json({ message: 'Login successful', user });
  } else {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }
}
