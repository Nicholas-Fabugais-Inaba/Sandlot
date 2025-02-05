import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

export default async function registerTeam(newTeam: any): Promise<void> {
    axios.post(`http://${APIHOST}/user/create_team`, newTeam).then((response) => {
      console.log("server response: " + response.status);
      console.log("account created");
    }).catch((error) => {
      console.log(error.response);
      console.log("Error " + error.response.status + ": " + error.response.data.detail);
    })
}