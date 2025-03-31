import axios from "axios";

export default async function preseasonToSeason(): Promise<any> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_APIHOST}/season-setup/preseason_to_season`,
  );

  return response.data;
}
