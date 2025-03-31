import axios from "axios";

export default async function getFields(): Promise<any> {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_APIHOST}/season-setup/get_fields`);

  return response.data;
}
