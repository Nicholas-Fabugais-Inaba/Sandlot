import axios from "axios";

export default async function getHomeDirectories(): Promise<any> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_APIHOST}/home/get_directories`,
  );

  return response.data;
}