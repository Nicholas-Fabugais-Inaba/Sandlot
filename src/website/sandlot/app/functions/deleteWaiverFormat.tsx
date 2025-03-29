import axios from "axios";

export default async function deleteWaiverFormatByYear(year: any): Promise<void> {
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/waiver/delete_waiver_format_by_year`, year)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("waiver format deleted");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
