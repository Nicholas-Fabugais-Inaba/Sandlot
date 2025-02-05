import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

export default async function registerPlayer(newUser: any): Promise<void> {
    axios.post(`http://${APIHOST}/user/create_player`, newUser).then((response) => {
      console.log("server response: " + response.status);
      console.log("account created");
    }).catch((error) => {
      console.log(error.response);
      console.log("Error " + error.response.status + ": " + error.response.data.detail);
    })
}