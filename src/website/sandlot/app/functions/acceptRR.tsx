import axios from "axios";

export default async function acceptRR(acceptInfo: any): Promise<void> {
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/schedule/reschedule_request_accepted`, acceptInfo)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("RR accepted");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
