import axios from "axios";

export default async function getScore(game_id: any): Promise<any> {
  // Make a dict that includes the game_id
  const data = { game_id };
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_APIHOST}/schedule/get_score`,
    data,
  );

  console.log("Score: ", response.data);

  return response.data;
}
