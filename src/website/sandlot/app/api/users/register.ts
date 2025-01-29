import bcrypt from 'bcrypt';

// Use the same mock users array as in login.ts
let mockUsers: { id: string; email: string; password: string }[] = [];

// Function to handle user registration
export async function registerUser(email: string, password: string) {
  // Check if the user already exists
  const existingUser = mockUsers.find((user) => user.email === email);

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user object
  const newUser = {
    id: Math.random().toString(36).substring(7), // Temporary ID generation
    email,
    password: hashedPassword,
  };

  // Store the new user in the mock database
  mockUsers.push(newUser);

  return newUser;
}
