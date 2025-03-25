import axios from "axios";

export default async function getArchivedTeam(archivedTeamData: any): Promise<any> {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_APIHOST}/archive/get_archived_team`, archivedTeamData);

  return response.data;
}