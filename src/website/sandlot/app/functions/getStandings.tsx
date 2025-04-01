import axios from "axios";

export default async function getStandings(): Promise<any> {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_APIHOST}/standings/get`);

  console.log(response.data);

  return response.data;
}
