import axios from "axios";

interface EndSeasonData {
    archive_teams: boolean
}

export default async function endSeason(data: EndSeasonData): Promise<any> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_APIHOST}/season-setup/end_season`,
    data,
  );

  return response.data;
}
