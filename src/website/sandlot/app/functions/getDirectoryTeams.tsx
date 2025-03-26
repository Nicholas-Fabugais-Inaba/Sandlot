import axios from "axios";

export default async function getDirectoryTeams(): Promise<any> {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_APIHOST}/directory/get_teams`);

  console.log(response.data);

  return response.data;
}
