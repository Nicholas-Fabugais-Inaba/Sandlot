import axios from "axios";

export default async function updateAnnouncement(
  announcementData: any,
): Promise<void> {
  axios
    .post(
      `${process.env.NEXT_PUBLIC_APIHOST}/announcement/update_announcement`,
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
