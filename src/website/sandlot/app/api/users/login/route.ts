import bcrypt from 'bcrypt';

// Mock database query for users
let mockUsers: { id: string; email: string; password: string }[] = [];

(async () => {
  mockUsers = [
    { id: '1', email: 'john.doe@example.com', password: await bcrypt.hash('password123', 10) },
    // Add more users if needed
  ];
})();

export async function authenticateUser(email: string, password: string) {
  const user = mockUsers.find((user) => user.email === email);

  // Check if the user exists and if the entered password matches the stored hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    return { id: user.id, name: 'John Doe', email: user.email };
  }
  return null;
}
