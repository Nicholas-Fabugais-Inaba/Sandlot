import axios from "axios";

export default async function getAllArchivedTeams(): Promise<any> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_APIHOST}/archive/get_all_archived_teams`,
  );

  return response.data;
}