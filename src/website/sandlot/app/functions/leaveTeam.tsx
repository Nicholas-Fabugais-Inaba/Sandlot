import axios from "axios";

export default async function leaveTeam(leaveTeamData: any): Promise<void> {
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/team-players/leave_team`, leaveTeamData)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("left team");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}