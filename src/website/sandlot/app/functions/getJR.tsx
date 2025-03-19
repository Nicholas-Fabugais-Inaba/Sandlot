import axios from "axios";

export default async function getJR(team_id: any): Promise<any> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_APIHOST}/join/get_join_requests`,
    team_id,
  );

  return response.data;
}
