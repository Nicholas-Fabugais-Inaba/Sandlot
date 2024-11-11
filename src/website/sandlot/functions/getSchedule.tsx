import axios from 'axios';

const APIHOST = `127.0.0.1:8000`;

export default async function getSchedule(): Promise<any[]> {
  try {
    const response = await axios.get(`http://${APIHOST}/schedule`);
    const [gamesData, teamsData] = response.data;

    // Helper function to format time slots
    const getTimeSlot = (timeSlot: number): [string, string] => {
      if (timeSlot == 1) {
        return ['17:00:00', '18:30:00']; // 5:00-6:30 PM
      } else if (timeSlot == 2) {
        return ['18:30:00', '20:00:00']; // 6:30-8:00 PM
      } else if (timeSlot == 3) {
        return ['20:00:00', '21:30:00']; // 8:00-9:30 PM
      } else {
        return ['00:00:00', '00:00:00']; // Default (if something goes wrong)
      }
    };

    // Parse and format the games data
    const formattedEvents = Object.entries(gamesData).map(([key, value]: any) => {

      // Destructure the key and value
      const [field, timeSlot, year, month, day] = key.split(",");
      const [team1Id, team2Id] = value;
      
      // Extract the names of the teams from teamsData
      const team1Name = teamsData[team1Id]?.name || `Team ${team1Id}`;
      const team2Name = teamsData[team2Id]?.name || `Team ${team2Id}`;

      // Format the date as YYYY-MM-DD
      const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      // Get the start and end times for the slot
      const [startTime, endTime] = getTimeSlot(timeSlot);

      // Construct the FullCalendar event object
      return {
        title: `Game: ${team1Name} vs ${team2Name} (Field ${field})`,
        start: `${formattedDate}T${startTime}`,
        end: `${formattedDate}T${endTime}`,
      };
    });

    return formattedEvents;
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return [];
  }
}
