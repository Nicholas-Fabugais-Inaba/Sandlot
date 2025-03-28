import axios from "axios";

export default async function deleteHomeDirectory(
  directoryID: any,
): Promise<void> {
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/home/delete_directory`, directoryID)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("directory deleted");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}