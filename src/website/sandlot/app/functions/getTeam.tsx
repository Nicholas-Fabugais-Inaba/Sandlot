import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

export default async function getTeam(username: any): Promise<any> {
  const response = await axios.post(`http://${APIHOST}/user/get_team`, username)
  return response.data
}