import axios from "axios";

const APIHOST = `127.0.0.1:8000`;

export default async function getJR(team_id: any): Promise<any> {
  const response = await axios.post(
    `http://${APIHOST}/join/get_join_requests`,
    team_id,
  );

  return response.data;
}
