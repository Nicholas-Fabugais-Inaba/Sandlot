import axios from "axios";

export default async function getPlayerWaivers(playerID: { player_id: number }): Promise<any> {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_APIHOST}/waiver/get_player_waivers`, playerID);

  return response.data;
}