import axios from "axios";

export default async function getSeasonSettings(): Promise<any> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_APIHOST}/season-setup/get_season_settings`,
  );

  console.log(response.data);

  return response.data;
}
