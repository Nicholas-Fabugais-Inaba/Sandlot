import axios from "axios";

const APIHOST = `127.0.0.1:8000`;

export default async function acceptRR(acceptInfo: any): Promise<void> {
  axios
    .post(`http://${APIHOST}/schedule/reschedule_request_accepted`, acceptInfo)
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
