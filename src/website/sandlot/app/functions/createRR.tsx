import axios from "axios";

export default async function createRR(rescheduleRequest: any): Promise<void> {
  axios
    .post(
      `${process.env.NEXT_PUBLIC_APIHOST}/schedule/create_reschedule_request`,
      rescheduleRequest,
    )
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("RR created");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
