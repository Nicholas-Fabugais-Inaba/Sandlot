import axios from "axios";

export default async function getAllWaivers(): Promise<any> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_APIHOST}/waiver/get_all_waivers`,
  );

  return response.data;
}