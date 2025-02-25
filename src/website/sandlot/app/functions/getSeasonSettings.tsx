import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

export default async function getSeasonSettings(): Promise<any> {
  const response = await axios.get(`http://${APIHOST}/commissioner/get_season_settings`)
  return response.data
}