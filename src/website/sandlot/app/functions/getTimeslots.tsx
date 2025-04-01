import axios from "axios";

export default async function getTimeslots(): Promise<any> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_APIHOST}/season-setup/get_timeslots`,
  );

  return response.data;
}
