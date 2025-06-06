import axios from "axios";

export default async function createHomeDirectory(newHomeDirectory: any): Promise<void> {
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/home/create_directory`, newHomeDirectory)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("home directory created");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}