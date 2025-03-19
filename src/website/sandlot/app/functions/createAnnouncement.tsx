import axios from "axios";

const APIHOST = `127.0.0.1:8000`;

export default async function createAnnouncement(newAnnouncement: {
  date: String;
  title: String;
  body: String;
}): Promise<void> {
  axios
    .post(`http://${APIHOST}/announcement/create_announcement`, newAnnouncement)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("announcement created");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
