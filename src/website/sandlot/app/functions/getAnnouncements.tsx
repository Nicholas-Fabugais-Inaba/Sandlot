import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

export default async function getAnnouncements(): Promise<any> {
  const response = await axios.get(`http://${APIHOST}/announcement/get_announcements`)
  return response.data
}