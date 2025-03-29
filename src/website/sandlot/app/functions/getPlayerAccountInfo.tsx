import axios from "axios";

export default async function getPlayerAccountData(player_id: number): Promise<any> {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_APIHOST}/user/get_player_account_data`, {player_id: player_id});

  console.log(response.data);

  let playerAccountData = {
    email: response.data.email,
    firstName: response.data.first_name,
    lastName: response.data.last_name,
    gender: response.data.gender,
    active: response.data.active,
  };

  return playerAccountData;
}
