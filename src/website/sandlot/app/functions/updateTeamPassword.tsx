import axios from "axios";

const APIHOST = `127.0.0.1:8000`;

export default async function updateTeamPassword(teamPasswordData: {
  team_id: Number;
  new_password: String;
}): Promise<void> {
  axios
    .put(`http://${APIHOST}/team/update_team_password`, teamPasswordData)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("team's password updated");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
