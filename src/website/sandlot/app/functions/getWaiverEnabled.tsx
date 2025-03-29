import axios from "axios";

export default async function getWaiverEnabled(): Promise<any> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_APIHOST}/season-setup/get_season_state`,
  );

  return response.data["state"];
}
