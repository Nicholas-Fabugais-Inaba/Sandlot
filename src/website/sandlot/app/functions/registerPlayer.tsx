import axios from "axios";

// TODO: changes param types and output types
export default async function registerPlayer(newUser: any): Promise<void> {
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/user/create_player`, newUser)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("account created");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
