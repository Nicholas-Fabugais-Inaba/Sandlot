import axios from "axios";

export default async function updateCaptainStatus(
  captainData: any,
): Promise<void> {
  axios
    .post(
      `${process.env.NEXT_PUBLIC_APIHOST}/team-players/update_captain_status`,
      captainData,
    )
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("captain status updated");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
