import axios from "axios";

export default async function getSolsticeSettings(): Promise<any> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_APIHOST}/schedule/get_solstice_settings`,
  );

  console.log("getSolsticeSettings response", response.data);

  return response.data;
}
