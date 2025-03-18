// app/api/teams/database.ts

export type JoinRequest = {
  email: string;
  name: string;
};

export type Team = {
  id: string;
  teamName: string;
  captainEmail: string;
  players: string[];
  joinRequests: JoinRequest[]; // Now stores objects with email and name
};

export const mockTeams: Team[] = [
  {
    id: "team-1",
    teamName: "Team A",
    captainEmail: "captainA@example.com",
    players: ["player1@example.com"],
    joinRequests: [
      { email: "player2@example.com", name: "Player Two" }, // Now includes name
    ],
  },
  {
    id: "team-2",
    teamName: "Team B",
    captainEmail: "captainB@example.com",
    players: ["player3@example.com"],
    joinRequests: [],
  },
];

export function findTeamById(teamId: string): Team | undefined {
  return mockTeams.find((team) => team.id === teamId);
}

export function updateTeam(teamId: string, updatedData: Partial<Team>) {
  const team = findTeamById(teamId);

  if (!team) return null;

  Object.assign(team, updatedData);

  return team;
}
