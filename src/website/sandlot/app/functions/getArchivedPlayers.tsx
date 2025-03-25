import axios from "axios";

export default async function getArchivedPlayers(archivedTeamID: { archived_team_id: number }): Promise<any> {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_APIHOST}/archive/get_archived_players_by_team`, archivedTeamID);

  return response.data;
}