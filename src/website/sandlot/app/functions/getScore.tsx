import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

export default async function getScore(game_id: any): Promise<any> {
  // Make a dict that includes the game_id
  const data = { game_id };
  const response = await axios.post(`http://${APIHOST}/schedule/get_score`, data);
  console.log("Score: ", response.data);
  return response.data;
}