import axios from "axios";

const APIHOST = `127.0.0.1:8000`;

export default async function deleteField(fieldID: Number): Promise<void> {
  axios
    .post(`http://${APIHOST}/season-setup/delete_field`, fieldID)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("field deleted");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
