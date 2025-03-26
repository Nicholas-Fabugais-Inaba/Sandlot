import axios from "axios";

export default async function getPlayerActiveTeam(playerId: number): Promise<any> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_APIHOST}/user/get_player_active_team`,
    {player_id: playerId},
  );

  return response.data;
}
