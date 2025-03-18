// app/api/users/database.ts

export const mockUsers: {
  id: string;
  email: string;
  password: string;
  name?: string;
  gender?: string;
  teamName?: string;
  accountType: "player" | "team";
}[] = [];

export function findUserByEmail(email: string) {
  return mockUsers.find((user) => user.email === email);
}

export function findUserByName(name: string) {
  return mockUsers.find((user) => user.name === name);
}
