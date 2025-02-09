import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

export default async function createRR(rescheduleRequest: any): Promise<void> {
    axios.post(`http://${APIHOST}/schedule/create_reschedule_request`, rescheduleRequest).then((response) => {
      console.log("server response: " + response.status);
      console.log("RR created");
    }).catch((error) => {
      console.log(error.response);
      console.log("Error " + error.response.status + ": " + error.response.data.detail);
    })
}