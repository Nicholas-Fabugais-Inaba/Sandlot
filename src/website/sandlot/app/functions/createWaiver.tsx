import axios from "axios";

export default async function createWaiver(waiverData: any): Promise<void> {
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/waiver/create_waiver`, waiverData)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("waiver created");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}