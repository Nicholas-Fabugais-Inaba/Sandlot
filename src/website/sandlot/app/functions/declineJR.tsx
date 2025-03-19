import axios from "axios";

const APIHOST = `127.0.0.1:8000`;

export default async function acceptJR(jrID: any): Promise<void> {
  axios
    .post(`http://${APIHOST}/join/join_request_declined`, jrID)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("JR declined");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
