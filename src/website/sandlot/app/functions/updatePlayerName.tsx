import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

export default async function updatePlayerName(playerNameData: {player_id: Number, first_name: String, last_name: String}): Promise<void> {
    axios.put(`http://${APIHOST}/user/update_player_name`, playerNameData).then((response) => {
      console.log("server response: " + response.status);
      console.log("player's name updated");
    }).catch((error) => {
      console.log(error.response);
      console.log("Error " + error.response.status + ": " + error.response.data.detail);
    })
}
