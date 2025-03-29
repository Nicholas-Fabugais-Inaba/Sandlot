import axios from "axios";

export default async function getWaiverEnabled(): Promise<any> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_APIHOST}/season-setup/get_waiver_enabled`,
  );

  return response.data;
}
