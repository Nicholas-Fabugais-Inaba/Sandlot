import axios from "axios";

export default async function deleteTimeslot(
  timeslotID: Number,
): Promise<void> {
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/season-setup/delete_timeslot`, timeslotID)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("timeslot deleted");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
