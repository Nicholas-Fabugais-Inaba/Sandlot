import axios from "axios";

export default async function getPlayer(email: any): Promise<any> {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_APIHOST}/user/get_player`, email);

  return response.data;
}
