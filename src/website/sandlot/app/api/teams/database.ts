// app/api/teams/database.ts

export type Team = { 
    id: string; 
    teamName: string; 
    captainEmail: string; 
    players: string[]; 
    joinRequests: string[]; 
};

export const mockTeams: Team[] = [
{
    id: "team-1",
    teamName: "Team A",
    captainEmail: "captainA@example.com",
    players: ["player1@example.com"],
    joinRequests: ["player2@example.com"],
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
    return mockTeams.find(team => team.id === teamId);
}  
