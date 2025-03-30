import axios from "axios";

interface Team {
  id: number;
  name: string;
  preferredDivision: string;
}

interface Division {
  id: number;
  name: string;
  teams: Team[];
}

export default async function getTeamsSeasonSetup(): Promise<Division[]> {
  const response_divisions = await axios.get(
    `${process.env.NEXT_PUBLIC_APIHOST}/season-setup/get_divisions`,
  );
  const response_teams = await axios.get(
    `${process.env.NEXT_PUBLIC_APIHOST}/season-setup/get_teams`,
  );
  const teamsData = response_teams.data;
  const divisionsData = response_divisions.data;

  const divisionsMap: { [key: number]: Division } = {};

  // Initialize divisions from divisionsData
  divisionsData.forEach((divisionData: any) => {
    divisionsMap[divisionData.id] = {
      id: divisionData.id,
      name: divisionData.division_name,
      teams: [],
    };
  });

  // Ensure "Team Bank" division is always included
  if (!divisionsMap[0]) {
    divisionsMap[0] = {
      id: 0,
      name: "Team Bank",
      teams: [],
    };
  }

  // Map teams to their respective divisions
  teamsData.forEach((teamData: any) => {
    const divisionId = teamData.division;

    if (divisionsMap[divisionId]) {
      divisionsMap[divisionId].teams.push({
        id: teamData.id,
        name: teamData.team_name,
        preferredDivision:
        teamData.preferred_division === 0
          ? "None"
          : divisionsMap[teamData.preferred_division]?.name || "Unknown Division",
      });
    }
  });

  const divisions: Division[] = Object.values(divisionsMap);

  console.log("Divisions: ", divisions);

  return divisions;
}
