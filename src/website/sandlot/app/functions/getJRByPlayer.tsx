import axios from "axios";

export default async function getJR(email: string): Promise<any> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_APIHOST}/join/get_join_requests_by_player`,
    {email: email},
  );

  console.log(response.data)

  return response.data;
}
