import axios from "axios";

export default async function updateTeamUsername(teamUsernameData: {
  team_id: Number;
  new_username: String;
}): Promise<void> {
  axios
    .put(`${process.env.NEXT_PUBLIC_APIHOST}/team/update_team_username`, teamUsernameData)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("team's username updated");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
