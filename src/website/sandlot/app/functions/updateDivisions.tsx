import axios from 'axios';

interface Team {
  id: number;
  name: string;
  preferredDivision: string;
}

interface Division {
  id: number;
  name: string;
  teams: Team[];
}

const APIHOST = `127.0.0.1:8000`;

export default async function updateTeamDivisions(divisions: Division[]): Promise<void> {

  let divisionDataList: any[] = [];

  for (let i = 1; i < divisions.length; i++) {
    divisionDataList.push({
      division_id: divisions[i].id,
      division_name: divisions[i].name
    });
  }
  console.log("divisionDataList: ", divisionDataList);

  axios.put(`http://${APIHOST}/season-setup/update_divisions`, divisionDataList).then((response) => {
    console.log("server response: " + response.status);
    console.log("team's division updated");
  }).catch((error) => {
    console.log(error.response);
    console.log("Error " + error.response.status + ": " + error.response.data.detail);
  })
}