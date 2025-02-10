import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

export default async function getRR(team_id: any): Promise<any> {
  const response = await axios.post(`http://${APIHOST}/schedule/get_reschedule_requests`, team_id)

  // TODO: insanely giga scuffed formatting need to be fixed
  let formmattedRequests = []
  for(let i = 0; i < response.data.length; i++) {
    console.log(response.data[i].reciever_id)
    console.log(team_id)
    if(response.data[i].reciever_id == team_id.team_id) {
      let proposedDates = []
      if(response.data[i].option1 != "") {
        proposedDates.push(new Date(response.data[i].option1))
      }
      if(response.data[i].option2 != "") {
        proposedDates.push(new Date(response.data[i].option2))
      }
      if(response.data[i].option3 != "") {
        proposedDates.push(new Date(response.data[i].option3))
      }
      if(response.data[i].option4 != "") {
        proposedDates.push(new Date(response.data[i].option4))
      }
      if(response.data[i].option5 != "") {
        proposedDates.push(new Date(response.data[i].option5))
      }
      formmattedRequests.push({
        id: response.data[i].id,
        originalDate: new Date(response.data[i].date),
        proposedDates: proposedDates,
        home: response.data[i].reciever_team_name,
        away: response.data[i].requester_team_name,
      })
    }
  }
  return formmattedRequests
}