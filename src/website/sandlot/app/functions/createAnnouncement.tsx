import axios from "axios";

export default async function createAnnouncement(newAnnouncement: {
  date: String;
  title: String;
  body: String;
}): Promise<void> {
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/announcement/create_announcement`, newAnnouncement)
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
