import axios from "axios";

export default async function registerTeam(newTeam: any): Promise<void> {
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/user/create_team`, newTeam)
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
