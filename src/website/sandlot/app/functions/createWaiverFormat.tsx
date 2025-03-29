import axios from "axios";

export default async function createWaiverFormat(waiverFormatData: any): Promise<void> {
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/waiver/insert_waiver_format`, waiverFormatData)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("waiver format created");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}