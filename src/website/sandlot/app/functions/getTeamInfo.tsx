import axios from "axios";

export default async function getTeamInfo(userTeamID: any): Promise<any> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_APIHOST}/team/get_players`,
    userTeamID,
  );

  console.log(response.data);

  return response.data;
}
