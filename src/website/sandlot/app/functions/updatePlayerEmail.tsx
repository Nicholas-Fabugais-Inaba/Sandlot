import axios from "axios";

const APIHOST = `127.0.0.1:8000`;

export default async function updatePlayerEmail(playerEmailData: {
  player_id: Number;
  new_email: String;
}): Promise<void> {
  axios
    .put(`http://${APIHOST}/user/update_player_email`, playerEmailData)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("player's email updated");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
