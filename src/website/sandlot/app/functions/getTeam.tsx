import axios from "axios";

export default async function getTeam(username: any): Promise<any> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_APIHOST}/user/get_team`,
    username,
  );

  return response.data;
}
