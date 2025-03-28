import axios from "axios";

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

export default async function updateDivisionsAndTeams(
  divisions: Division[],
): Promise<void> {
  let divisionDataList: any[] = [];

  for (let i = 0; i < divisions.length; i++) {
    if (divisions[i].teams.length === 0) {
      // Add an entry for empty divisions
      divisionDataList.push({
        team_id: 0,
        division: divisions[i].id,
        division_name: divisions[i].name,
      });
    } else {
      for (let j = 0; j < divisions[i].teams.length; j++) {
        divisionDataList.push({
          team_id: divisions[i].teams[j].id,
          division: divisions[i].id,
          division_name: divisions[i].name,
        });
      }
    }
  }
  console.log("divisionDataList: ", divisionDataList);

  axios
    .put(
      `${process.env.NEXT_PUBLIC_APIHOST}/season-setup/update_divisions_and_teams`,
      divisionDataList,
    )
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("team's division updated");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
