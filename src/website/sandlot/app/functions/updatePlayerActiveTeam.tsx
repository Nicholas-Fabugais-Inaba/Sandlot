import axios from "axios";

export default async function updatePlayerActiveTeam(playerActiveTeamData: {
  player_id: number;
  team_id: number;
}): Promise<void> {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_APIHOST}/user/update_player_active_team`,
      playerActiveTeamData
    );
    console.log("server response: " + response.status);
    console.log("player's active team updated");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response);
        console.log(
          "Error " + error.response.status + ": " + error.response.data.detail
        );
      } else {
        console.log("Error: " + error.message);
      }
    } else {
      console.log("Error: " + (error as Error).message);
    }
  }
}