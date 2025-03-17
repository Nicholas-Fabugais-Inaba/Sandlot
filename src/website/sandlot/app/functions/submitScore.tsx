import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

// score is a game_id and a home and away integer score

export default async function submitScore(score: object): Promise<void> {
    axios.post(`http://${APIHOST}/schedule/submit_score`, score).then((response) => {
      console.log("server response: " + response.status);
      console.log("score submitted");
    }).catch((error) => {
      console.log(error.response);
      console.log("Error " + error.response.status + ": " + error.response.data.detail);
    })
}
