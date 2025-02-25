import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

export default async function getTimeslots(): Promise<any> {
  const response = await axios.post(`http://${APIHOST}/commissioner/get_timeslots`)
  return response.data
}