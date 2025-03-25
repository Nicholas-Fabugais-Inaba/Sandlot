import axios from "axios";

export default async function createTimeslot(timeslotData: {
  start: String;
  end: String;
  field_id: Number;
}): Promise<void> {
  axios
    .post(`${process.env.NEXT_PUBLIC_APIHOST}/season-setup/insert_timeslot`, timeslotData)
    .then((response) => {
      console.log("server response: " + response.status);
      console.log("timeslot created");
    })
    .catch((error) => {
      console.log(error.response);
      console.log(
        "Error " + error.response.status + ": " + error.response.data.detail,
      );
    });
}
