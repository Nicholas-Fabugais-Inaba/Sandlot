import axios from 'axios';
import { Game, Event } from '../types';
import { Dictionary } from '@fullcalendar/core/internal';

const APIHOST = `127.0.0.1:8000`;

export default async function getSchedule(): Promise<Event[]> {
  try {
    const response = await axios.get(`http://${APIHOST}/schedule/get_all_games`);

    console.log(response.data)
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

    console.log(formattedEvents)
    return formattedEvents;

  } catch (error) {
    console.error("Error fetching schedule:", error);
    return [];
  }
}
