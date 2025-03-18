import axios from "axios";

const APIHOST = `127.0.0.1:8000`;

export default async function getTeamsDirectory(): Promise<any> {
  const response = await axios.get(`http://${APIHOST}/team/get_teams`);
  console.log(response.data);
  return response.data;
}
