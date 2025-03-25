import axios from "axios";

const APIHOST = `127.0.0.1:8000`;

interface CommissionerRescheduleData {
	game_id: number;
	date: string;
	time: string;
	field: string;
}

export default async function commissionerReschedule(rescheduleData: CommissionerRescheduleData): Promise<void> {
  axios
    .post(`http://${APIHOST}/schedule/commissioner_reschedule`, rescheduleData)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("Commissioner reschedule accepted");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
