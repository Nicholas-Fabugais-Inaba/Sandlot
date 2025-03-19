import axios from "axios";

const APIHOST = `127.0.0.1:8000`;

export default async function updateAnnouncement(announcementData: {
  announcement_id: Number;
  new_date: String;
  new_title: String;
  new_body: String;
}): Promise<void> {
  axios
    .post(
      `http://${APIHOST}/announcement/update_announcement`,
      announcementData,
    )
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("announcement updated");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
