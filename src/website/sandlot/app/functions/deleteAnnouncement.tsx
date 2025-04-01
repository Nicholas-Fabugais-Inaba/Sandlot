import axios from "axios";

export default async function deleteAnnouncement(
  announcementID: any,
): Promise<void> {
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/announcement/delete_announcement`, announcementID)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("announcement deleted");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
