import axios from "axios";

export default async function getDivisions(): Promise<any> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_APIHOST}/season-setup/get_divisions`,
  );

  console.log("getDivisions response:", response.data);

  return response.data;
}