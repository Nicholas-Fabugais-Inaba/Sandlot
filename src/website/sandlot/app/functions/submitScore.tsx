import axios from "axios";

const APIHOST = `127.0.0.1:8000`;

export default async function submitScore(scoreData: any): Promise<void> {
  console.log("Submitting score...", scoreData);
  axios
    .post(`http://${APIHOST}/schedule/submit_score`, scoreData)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("score reported");
    })
    .catch((error) => {})
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
