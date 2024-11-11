import axios from 'axios'


const APIHOST = `127.0.0.1:8000`;

export default async function getSchedule(): Promise<{schedule: number}[]> {
    const RESULT = axios.get(`http://${APIHOST}/schedule`, {params: {/* input value here */}}).then((response) => {
        return response.data
    })
    return RESULT
}