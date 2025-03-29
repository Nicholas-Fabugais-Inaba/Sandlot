import axios from "axios";

export default async function getWaiverFormatByYear(year:any): Promise<any> {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_APIHOST}/waiver/get_waiver_format_by_year`, year);

  return response.data;
}
