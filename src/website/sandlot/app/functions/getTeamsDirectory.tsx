import axios from "axios";

export default async function getTeamsDirectory(): Promise<any> {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_APIHOST}/directory/get`);

  console.log(response.data);

  return response.data;
}
