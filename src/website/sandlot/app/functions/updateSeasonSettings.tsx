import axios from "axios";

interface Field {
  id: number;
  name: string;
  timeslotIds: number[];
}

interface Timeslot {
  id: number;
  startTime: string;
  endTime: string;
}

interface SeasonSettings {
  start_date: string;
  end_date: string;
  games_per_team: number;
  game_days: string[];
  fields: Field[];
  timeslots: Timeslot[];
}

export default async function updateSeasonSettings(SeasonSettings: SeasonSettings): Promise<void> {
  console.log("updating season settings...", SeasonSettings);
  axios
    .put(
      `${process.env.NEXT_PUBLIC_APIHOST}/season-setup/update_season_settings`,
      SeasonSettings,
    )
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("season settings updated");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
