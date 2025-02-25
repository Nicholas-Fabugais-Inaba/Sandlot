import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

export default async function updateDivision(divisionData: {team_id: Number, division: Number}): Promise<void> {
    axios.post(`http://${APIHOST}/commissioner/update_division`, divisionData).then((response) => {
      console.log("server response: " + response.status);
      console.log("team's division updated");
    }).catch((error) => {
      console.log(error.response);
      console.log("Error " + error.response.status + ": " + error.response.data.detail);
    })
}