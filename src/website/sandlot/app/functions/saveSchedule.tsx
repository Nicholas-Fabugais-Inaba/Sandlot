import axios from "axios";

export default async function saveSchedule(schedule: object): Promise<void> {
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/season-setup/create_schedule`, schedule)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("schedule created");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
