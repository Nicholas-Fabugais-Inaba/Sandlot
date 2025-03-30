import axios from "axios";

interface DenyInfo {
  rr_id: number;
}

export default async function denyRR(denyInfo: DenyInfo): Promise<void> {
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/schedule/reschedule_request_denied`, denyInfo)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("RR denied");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
