import axios from "axios";

export default async function updateDivision(divisionData: {
  team_id: Number;
  division: Number;
}): Promise<void> {
  axios
    .put(`${process.env.NEXT_PUBLIC_APIHOST}/season-setup/update_team_division`, divisionData)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("team's division updated");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
