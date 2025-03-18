import axios from "axios";

const APIHOST = `127.0.0.1:8000`;

export default async function getFields(): Promise<any> {
  const response = await axios.get(`http://${APIHOST}/season-setup/get_fields`);
  return response.data;
}
