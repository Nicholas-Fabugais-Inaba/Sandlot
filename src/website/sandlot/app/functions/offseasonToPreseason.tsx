import axios from "axios";

export default async function offseasonToPreseason(): Promise<any> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_APIHOST}/season-setup/offseason_to_preseason`,
  );

  return response.data;
}
