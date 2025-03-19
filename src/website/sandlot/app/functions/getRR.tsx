import axios from "axios";

const APIHOST = `127.0.0.1:8000`;

export default async function getRR(team_id: any): Promise<any> {
  const response = await axios.post(
    `http://${APIHOST}/schedule/get_reschedule_requests`,
    team_id,
  );

  // TODO: insanely giga scuffed formatting need to be fixed
  let formmattedRequests = [];

  for (let i = 0; i < response.data.length; i++) {
    console.log(response.data[i]);
    // console.log(response.data[i].reciever_id)
    // console.log(team_id)
    if (response.data[i].reciever_id == team_id.team_id) {
      let proposedDates = [];

      if (response.data[i].option1 != "") {
        proposedDates.push(new Date(response.data[i].option1));
      }
      if (response.data[i].option2 != "") {
        proposedDates.push(new Date(response.data[i].option2));
      }
      if (response.data[i].option3 != "") {
        proposedDates.push(new Date(response.data[i].option3));
      }
      if (response.data[i].option4 != "") {
        proposedDates.push(new Date(response.data[i].option4));
      }
      if (response.data[i].option5 != "") {
        proposedDates.push(new Date(response.data[i].option5));
      }

      let proposedFields = [];

      if (response.data[i].option1_field != "") {
        proposedFields.push(response.data[i].option1_field);
      }
      if (response.data[i].option2_field != "") {
        proposedFields.push(response.data[i].option2_field);
      }
      if (response.data[i].option3_field != "") {
        proposedFields.push(response.data[i].option3_field);
      }
      if (response.data[i].option4_field != "") {
        proposedFields.push(response.data[i].option4_field);
      }
      if (response.data[i].option5_field != "") {
        proposedFields.push(response.data[i].option5_field);
      }

      // Sets game time according to the time from database
      let datetime = new Date(response.data[i].date);

      if (response.data[i].time === "1") {
        datetime.setUTCHours(21, 0, 0);
      } else if (response.data[i].time === "2") {
        datetime.setUTCHours(22, 30, 0);
      } else if (response.data[i].time === "3") {
        datetime.setUTCHours(24, 0, 0);
      } else if (response.data[i].time === "4") {
        datetime.setUTCHours(25, 30, 0);
      }

      formmattedRequests.push({
        id: response.data[i].id,
        game_id: response.data[i].game_id,
        originalDate: datetime,
        originalField: response.data[i].field,
        proposedDates: proposedDates,
        proposedFields: proposedFields,
        reciever_name: response.data[i].reciever_team_name,
        requester_name: response.data[i].requester_team_name,
        reciever_id: response.data[i].reciever_id,
        requester_id: response.data[i].requester_id,
      });
    }
  }

  return formmattedRequests;
}
