import axios from 'axios';
import { hash } from 'bcrypt';

const APIHOST = `127.0.0.1:8000`;

export default async function authenticateAccount(email: any): Promise<any> {
  const response = await axios.post(`http://${APIHOST}/user/login`, email)
  return response.data
}