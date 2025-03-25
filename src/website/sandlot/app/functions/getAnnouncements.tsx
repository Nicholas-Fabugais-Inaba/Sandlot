import axios from "axios";

export default async function getAnnouncements(): Promise<any> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_APIHOST}/announcement/get_announcements`,
  );

  return response.data;
}
