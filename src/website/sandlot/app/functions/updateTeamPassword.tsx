import axios from "axios";

export default async function updateTeamPassword(teamPasswordData: {
  team_id: Number;
  new_password: String;
}): Promise<void> {
  axios
    .put(`${process.env.NEXT_PUBLIC_APIHOST}/team/update_team_password`, teamPasswordData)
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
