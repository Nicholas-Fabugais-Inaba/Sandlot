import axios from "axios";

interface SolsticeSettings {
  active: boolean;
  start: string;
  end: string;
}

export default async function getRR(team_id: any, timeslots: any, solsticeSettings: SolsticeSettings): Promise<any> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_APIHOST}/schedule/get_reschedule_requests`,
    team_id,
  );

  const solsticeStart = new Date(solsticeSettings.start);
  const solsticeEnd = new Date(solsticeSettings.end);

  let formmattedRequests = [];
  let pendingRequests = [];

  for (let i = 0; i < response.data.length; i++) {
    console.log(response.data[i]);

    if (response.data[i].receiver_id == team_id.team_id) {
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

      let proposedTimeslots = [];

      if (response.data[i].option1_timeslot != "") {
        proposedTimeslots.push(response.data[i].option1_timeslot);
      }
      if (response.data[i].option2_timeslot != "") {
        proposedTimeslots.push(response.data[i].option2_timeslot);
      }
      if (response.data[i].option3_timeslot != "") {
        proposedTimeslots.push(response.data[i].option3_timeslot);
      }
      if (response.data[i].option4_timeslot != "") {
        proposedTimeslots.push(response.data[i].option4_timeslot);
      }
      if (response.data[i].option5_timeslot != "") {
        proposedTimeslots.push(response.data[i].option5_timeslot);
      }

      // Sets game time according to the time from database
      let datetime = new Date(response.data[i].date);

      // Use the helper function to get the selected timeslot
      const selectedTimeslot = getSelectedTimeslot(
        timeslots,
        response.data[i].field,
        response.data[i].time,
      );

      if (selectedTimeslot) {
        const [startHour, startMinute] = selectedTimeslot.start.split("-").map(Number);

        // Adjust for solstice period based on the response date
        if (
          solsticeSettings.active &&
          (response.data[i].field === "1" || response.data[i].field === "2") &&
          datetime >= solsticeStart &&
          datetime <= solsticeEnd
        ) {
          datetime.setUTCHours(startHour + 1, startMinute, 0); // Push start hour forward by 1
        } else {
          datetime.setUTCHours(startHour, startMinute, 0); // Use the original start time
        }
      } else {
        console.warn(
          `No matching timeslot found for field ${response.data[i].field} and time ID: ${response.data[i].time}`,
        );
      }

      formmattedRequests.push({
        id: response.data[i].id,
        game_id: response.data[i].game_id,
        originalDate: datetime,
        originalField: response.data[i].field,
        proposedDates: proposedDates,
        proposedFields: proposedFields,
        proposedTimeslots: proposedTimeslots,
        receiver_name: response.data[i].receiver_team_name,
        requester_name: response.data[i].requester_team_name,
        receiver_id: response.data[i].receiver_id,
        requester_id: response.data[i].requester_id,
      });
    } else if (response.data[i].requester_id == team_id.team_id) {

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

      let proposedTimeslots = [];

      if (response.data[i].option1_timeslot != "") {
        proposedTimeslots.push(response.data[i].option1_timeslot);
      }
      if (response.data[i].option2_timeslot != "") {
        proposedTimeslots.push(response.data[i].option2_timeslot);
      }
      if (response.data[i].option3_timeslot != "") {
        proposedTimeslots.push(response.data[i].option3_timeslot);
      }
      if (response.data[i].option4_timeslot != "") {
        proposedTimeslots.push(response.data[i].option4_timeslot);
      }
      if (response.data[i].option5_timeslot != "") {
        proposedTimeslots.push(response.data[i].option5_timeslot);
      }

      console.log("Date: ", response.data[i].date);
      let datetime = new Date(response.data[i].date);

      // Use the helper function to get the selected timeslot
      const selectedTimeslot = getSelectedTimeslot(
        timeslots,
        response.data[i].field,
        response.data[i].time,
      );

      if (selectedTimeslot) {
        const [startHour, startMinute] = selectedTimeslot.start.split("-").map(Number);

        // Adjust for solstice period based on the response date
        if (
          solsticeSettings.active &&
          (response.data[i].field === "1" || response.data[i].field === "2") &&
          datetime >= solsticeStart &&
          datetime <= solsticeEnd
        ) {
          datetime.setUTCHours(startHour + 1, startMinute, 0); // Push start hour forward by 1
        } else {
          datetime.setUTCHours(startHour, startMinute, 0); // Use the original start time
        }
      } else {
        console.warn(
          `No matching timeslot found for field ${response.data[i].field} and time ID: ${response.data[i].time}`,
        );
      }
      console.log("Datetime: ", datetime);

      pendingRequests.push({
        id: response.data[i].id,
        game_id: response.data[i].game_id,
        originalDate: datetime,
        originalField: response.data[i].field,
        proposedDates: proposedDates,
        proposedFields: proposedFields,
        proposedTimeslots: proposedTimeslots,
        receiver_name: response.data[i].receiver_team_name,
        requester_name: response.data[i].requester_team_name,
        receiver_id: response.data[i].receiver_id,
        requester_id: response.data[i].requester_id,
      });
    }
  }

  return [formmattedRequests, pendingRequests];
}

function getSelectedTimeslot(timeslots: any[], field: string, time: string): any | null {
  // Filter timeslots by field_id
  const matchingTimeslots = timeslots
    .filter((ts: any) => ts.field_id.toString() === field)
    .sort((a: any, b: any) => {
      // Sort timeslots by start time (ascending)
      const [startHourA, startMinuteA] = a.start.split("-").map(Number);
      const [startHourB, startMinuteB] = b.start.split("-").map(Number);
      return startHourA - startHourB || startMinuteA - startMinuteB;
    });

  // Index the sorted timeslots from 1 to n
  const indexedTimeslots = matchingTimeslots.map((ts: any, index: number) => ({
    ...ts,
    index: (index + 1).toString(), // Add a 1-based index
  }));

  // Find the timeslot matching the given time
  const selectedTimeslot = indexedTimeslots.find((ts: any) => ts.index === time);

  return selectedTimeslot || null; // Return the selected timeslot or null if not found
}
