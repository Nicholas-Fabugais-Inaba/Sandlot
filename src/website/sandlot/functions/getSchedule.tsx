import axios from 'axios'


const APIHOST = `locahost:8000`;

export default async function getSchedule(): Promise<{schedule: number}[]> {
    const RESULT = axios.get(`https://${APIHOST}/schedule`, {params: {/* input value here */}}).then((response) => {
        return response.data
    })
    return RESULT
}