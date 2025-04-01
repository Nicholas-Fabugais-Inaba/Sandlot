import axios from "axios";

interface Game {
  id: number;
  date: string;
  time: string;
  field: string;
  forfeit: number;
  home_team_name: string;
  away_team_name: string;
  home_team_id: number;
  away_team_id: number;
  home_team_score: number;
  away_team_score: number;
  played: boolean;
}


export default async function getAllOccupiedGameslots(): Promise<Record<string, boolean>> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_APIHOST}/schedule/get_all_games`,
  );

  const games: Game[] = response.data;

  // Create a dictionary with keys as "date time field"
  const occupiedGameslots: Record<string, boolean> = {};
  games.forEach((game) => {
    const key = `${game.date} ${game.time} ${game.field}`;
    occupiedGameslots[key] = true;
  });

  return occupiedGameslots;
}