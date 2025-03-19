import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

export default async function updateTeamName(teamNameData: {team_id: Number, new_team_name: String}): Promise<void> {
    axios.put(`http://${APIHOST}/team/update_team_name`, teamNameData).then((response) => {
      console.log("server response: " + response.status);
      console.log("team's name updated");
    }).catch((error) => {
      console.log(error.response);
      console.log("Error " + error.response.status + ": " + error.response.data.detail);
    })
}
