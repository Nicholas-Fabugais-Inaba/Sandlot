import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

export default async function updateTeamUsername(teamUsernameData: {team_id: Number, new_username: String}): Promise<void> {
    axios.put(`http://${APIHOST}/team/update_team_username`, teamUsernameData).then((response) => {
      console.log("server response: " + response.status);
      console.log("team's username updated");
    }).catch((error) => {
      console.log(error.response);
      console.log("Error " + error.response.status + ": " + error.response.data.detail);
    })
}
