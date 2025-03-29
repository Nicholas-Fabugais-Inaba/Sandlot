import axios from "axios";

export default async function getPlayerWaivers(playerID: { player_id: number }): Promise<any> {
  console.log("getPlayerWaivers axios request:", playerID)
  const response = await axios.post(`${process.env.NEXT_PUBLIC_APIHOST}/waiver/get_player_waivers`, playerID);
  console.log("getPlayerWaivers axios response:", response.data)
  return response.data;
}