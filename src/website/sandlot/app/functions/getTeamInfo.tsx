import axios from "axios";

const APIHOST = `127.0.0.1:8000`;

export default async function getTeamInfo(userTeamID: any): Promise<any> {
  const response = await axios.post(
    `http://${APIHOST}/team/get_players`,
    userTeamID,
  );

  console.log(response.data);

  return response.data;
}
