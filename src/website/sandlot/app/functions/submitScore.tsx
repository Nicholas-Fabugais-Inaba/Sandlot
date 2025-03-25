import axios from "axios";

export default async function submitScore(scoreData: any): Promise<void> {
  console.log("Submitting score...", scoreData);
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/schedule/submit_score`, scoreData)
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
