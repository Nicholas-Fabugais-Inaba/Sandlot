import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

export default async function updateSeasonSettings(SeasonSettings: {start_date: String, end_date: String, games_per_team: Number}): Promise<void> {
    axios.post(`http://${APIHOST}/commissioner/update_season_settings`, SeasonSettings).then((response) => {
      console.log("server response: " + response.status);
      console.log("season settings updated");
    }).catch((error) => {
      console.log(error.response);
      console.log("Error " + error.response.status + ": " + error.response.data.detail);
    })
}