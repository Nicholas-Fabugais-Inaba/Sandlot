import axios from "axios";

export default async function createArchivedTeam(archivedTeamData: any): Promise<void> {
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/archive/create_archived_team`, archivedTeamData)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("archived team created");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}