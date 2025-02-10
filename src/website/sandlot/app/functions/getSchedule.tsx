import axios from 'axios';
import { Game, Event } from '../types';
import { get } from 'http';

const APIHOST = `127.0.0.1:8000`;
const currDate = new Date("2025-06-20");
const seasonStart = new Date("2025-05-05");
const seasonEnd = new Date("2025-08-20");

export default async function getSchedule(): Promise<Event[]> {
  try {
    const response = await axios.get(`http://${APIHOST}/schedule/get_all_games`);

    console.log(response.data)
    
    let formattedEvents = getFormattedEvents(response)
  
    console.log(formattedEvents)

    return formattedEvents;

  } catch (error) {
    console.error("Error fetching schedule:", error);
    return [];
  }
}

export async function getTeamSchedule(team_id: number): Promise<Event[]> {
  try {
    const response = await axios.post(`http://${APIHOST}/schedule/get_team_games`, {team_id: team_id}); 

    console.log(response.data)
    
    let formattedEvents = getFormattedEvents(response)
  
    console.log(formattedEvents)

    return formattedEvents;

  } catch (error) {
    console.error("Error fetching schedule:", error);
    return [];
  }
}

function getFormattedEvents(response: any) : Event[] {
  var eventsTemp: { [key: string]: Event} = {}

    for (const game of response.data) {
      var dateTime : string = game.date + game.time;

      // If the event doesn't exist, initialize it with start and end dates
      if (!(dateTime in eventsTemp)) {
        var start = new Date(game.date);
        var end = new Date(game.date);
        if (game.time === "1") {
          start.setHours(17);
          end.setHours(18);
          end.setMinutes(30);
        } else if (game.time === "2") {
          start.setHours(18);
          start.setMinutes(30);
          end.setHours(20);
        }
        else if (game.time === "3") {
          start.setHours(20);
          end.setHours(21);
          end.setMinutes(30);
        }
        else if (game.time === "4") {
          start.setHours(21);
          end.setMinutes(30);
          end.setHours(23)
        }
        eventsTemp[dateTime] = {
          start: start,
          end: end
        };
      }

      // Add the field property to the event
      if (game.field === "1") {
        eventsTemp[dateTime] = {
          ...eventsTemp[dateTime],
          field1: {
            id: game.id,
            home: game.home_team_name,
            home_id: game.home_team_id,
            away: game.away_team_name,
            away_id: game.away_team_id
          }
        }
      }
      else if (game.field === "2") {
        eventsTemp[dateTime] = {
          ...eventsTemp[dateTime],
          field2: {
            id: game.id,
            home: game.home_team_name,
            home_id: game.home_team_id,
            away: game.away_team_name,
            away_id: game.away_team_id
          }
        }
      }
      else if (game.field === "3") {
        eventsTemp[dateTime] = {
          ...eventsTemp[dateTime],
          field3: {
            id: game.id,
            home: game.home_team_name,
            home_id: game.home_team_id,
            away: game.away_team_name,
            away_id: game.away_team_id
          }
        }
      }
    }

    // Convert the dictionary to an array of events
    const formattedEvents: Event[] = [];
    for (const key in eventsTemp) {
      if (eventsTemp.hasOwnProperty(key)) {
        formattedEvents.push(eventsTemp[key]);
      }
    }

    return formattedEvents;
}

export function addEmptyEvents(events: Event[]) : Event[] {

  if (currDate > seasonEnd) {
    return events;
  }

  let startDate
  if (currDate > seasonStart) {
    startDate = currDate;
  } else {
    startDate = seasonStart;
  }

  while (startDate < seasonEnd) {
    // Skip weekends
    if (startDate.getDay() === 0 || startDate.getDay() === 6) {
      startDate.setDate(startDate.getDate() + 1);
      continue;
    }
    
    startDate.setHours(17);
    startDate.setMinutes(0);

    let eventExists = events.some(event => event.start.getTime() === startDate.getTime());

    if (!eventExists) {
      events.push({
        start: new Date(startDate),
        end: new Date(startDate.setHours(startDate.getHours() + 1, 30))
      });
    }

    startDate.setHours(18);
    startDate.setMinutes(30);

    eventExists = events.some(event => event.start.getTime() === startDate.getTime());

    if (!eventExists) {
      let end = new Date(startDate);
      end.setHours(20);
      end.setMinutes(0);
      events.push({
        start: new Date(startDate),
        end: end
      });
    }

    startDate.setHours(20);
    startDate.setMinutes(0);

    eventExists = events.some(event => event.start.getTime() === startDate.getTime());

    if (!eventExists) {
      events.push({
        start: new Date(startDate),
        end: new Date(startDate.setHours(startDate.getHours() + 1, 30))
      });
    }

    startDate.setDate(startDate.getDate() + 1);
  }

  return events;
}
