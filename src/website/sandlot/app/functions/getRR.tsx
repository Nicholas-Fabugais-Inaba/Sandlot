import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

export default async function getRR(team_id: any): Promise<any> {
  const response = await axios.post(`http://${APIHOST}/schedule/get_reschedule_requests`, team_id)
  console.log(response.data)
  return response.data
}