import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

export default async function getPlayer(email: any): Promise<any> {
  const response = await axios.post(`http://${APIHOST}/user/get_player`, email)
  return response.data
}