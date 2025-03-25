import axios from "axios";

export default async function getDirectoryPlayers(team_id: any): Promise<any> {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_APIHOST}/directory/get_players_in_team`, team_id);

  console.log(response.data);

  return response.data;
}
