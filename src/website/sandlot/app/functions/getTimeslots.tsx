import axios from "axios";

const APIHOST = `127.0.0.1:8000`;

export default async function getTimeslots(): Promise<any> {
  const response = await axios.get(
    `http://${APIHOST}/season-setup/get_timeslots`,
  );

  return response.data;
}
