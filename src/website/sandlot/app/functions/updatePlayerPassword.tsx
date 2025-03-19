import axios from "axios";

const APIHOST = `127.0.0.1:8000`;

export default async function updatePlayerPassword(playerPasswordData: {
  player_id: Number;
  new_password: String;
}): Promise<void> {
  axios
    .put(`http://${APIHOST}/user/update_player_password`, playerPasswordData)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("player's password updated");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
