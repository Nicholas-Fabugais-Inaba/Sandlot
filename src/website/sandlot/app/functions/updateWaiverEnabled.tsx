import axios from "axios";

export default async function updateWaiverEnabled(waiverEnabled: any,): Promise<void> {
  axios.post(`${process.env.NEXT_PUBLIC_APIHOST}/season-setup/update_waiver_enabled`, waiverEnabled,)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("waiver enabled updated");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
