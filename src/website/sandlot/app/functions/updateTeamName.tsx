import axios from "axios";

export default async function updateTeamName(teamNameData: {
  team_id: Number;
  new_team_name: String;
}): Promise<void> {
  axios
    .put(`${process.env.NEXT_PUBLIC_APIHOST}/team/update_team_name`, teamNameData)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("team's name updated");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
