import axios from 'axios'


const APIHOST = `127.0.0.1:8000`;

export default async function getSchedule(): Promise<{schedule: number}[]> {
    const RESULT = axios.get(`http://${APIHOST}/schedule`).then((response) => {
        console.log("here")
        console.log(response.data)
        return response.data
    })
    return RESULT
}