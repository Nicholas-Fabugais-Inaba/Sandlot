import axios from "axios";

export default async function acceptJR(acceptInfo: any): Promise<void> {
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/join/join_request_accepted`, acceptInfo)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("JR accepted");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
