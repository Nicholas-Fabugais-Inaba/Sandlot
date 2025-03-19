import axios from "axios";

const APIHOST = `127.0.0.1:8000`;

export default async function createJR(joinRequest: any): Promise<void> {
  axios
    .post(`http://${APIHOST}/join/create_join_request`, joinRequest)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("JR created");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
