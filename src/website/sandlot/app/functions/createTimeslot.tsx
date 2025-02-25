import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

export default async function createTimeslot(timeslotData: {start: String, end: String, field_id: Number}): Promise<void> {
    axios.post(`http://${APIHOST}/commissioner/insert_timeslot`, timeslotData).then((response) => {
      console.log("server response: " + response.status);
      console.log("timeslot created");
    }).catch((error) => {
      console.log(error.response);
      console.log("Error " + error.response.status + ": " + error.response.data.detail);
    })
}