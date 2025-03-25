import axios from "axios";

export default async function createField(fieldName: String): Promise<void> {
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/season-setup/insert_field`, fieldName)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("field created");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
