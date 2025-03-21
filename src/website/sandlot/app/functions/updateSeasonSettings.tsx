import axios from "axios";

export default async function updateSeasonSettings(SeasonSettings: {
  start_date: String;
  end_date: String;
  games_per_team: Number;
}): Promise<void> {
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
