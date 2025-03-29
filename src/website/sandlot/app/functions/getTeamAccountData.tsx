import axios from "axios";

export default async function getTeamAccountData(team_id: number): Promise<any> {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_APIHOST}/user/get_team_account_data`, {team_id: team_id});

  console.log(response.data);

  let teamAccountData = {
    username: response.data.username,
    teamName: response.data.team_name,
    active: response.data.active,
  };

  return teamAccountData;
}
