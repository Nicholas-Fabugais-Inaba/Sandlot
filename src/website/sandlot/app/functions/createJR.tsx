import axios from "axios";

export default async function createJR(joinRequest: any): Promise<void> {
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/join/create_join_request`, joinRequest)
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
