import axios from "axios";

export default async function deleteField(fieldID: Number): Promise<void> {
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/season-setup/delete_field`, fieldID)
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
