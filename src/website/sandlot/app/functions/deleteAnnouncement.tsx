import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

export default async function deleteAnnouncement(announcementID: any): Promise<void> {
    axios.post(`http://${APIHOST}/announcement/delete_announcement`, announcementID).then((response) => {
      console.log("server response: " + response.status);
      console.log("announcement deleted");
    }).catch((error) => {
      console.log(error.response);
      console.log("Error " + error.response.status + ": " + error.response.data.detail);
    })
}