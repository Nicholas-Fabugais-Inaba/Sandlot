import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

export default async function getTeamsSeasonSetup(): Promise<any> {
  const response = await axios.get(`http://${APIHOST}/season-setup/get_teams`)
  console.log(response.data)
  return response.data
}