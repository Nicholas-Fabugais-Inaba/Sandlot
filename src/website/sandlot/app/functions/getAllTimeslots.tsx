import axios from "axios";

export default async function getAllTimeslots(): Promise<any> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_APIHOST}/schedule/get_all_timeslots`,
  );

  console.log(response.data);

  return response.data;
}