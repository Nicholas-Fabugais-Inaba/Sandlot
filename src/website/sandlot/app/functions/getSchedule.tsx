import axios from 'axios';
import { Event, GenSchedResponse } from '../types';
import { Dictionary } from '@fullcalendar/core/internal';

const APIHOST = `127.0.0.1:8000`;
const currDate = new Date("2025-06-20");
const seasonStart = new Date("2025-05-05");
const seasonEnd = new Date("2025-08-20");

interface Game {
  id: number;
  date: string;
  time: string;
  field: string;
  home_team_name: string;
  home_team_id: number;
  away_team_name: string;
  away_team_id: number;
}

export default async function getSchedule(): Promise<Event[]> {
  try {
    const response = await axios.get(`http://${APIHOST}/schedule/get_all_games`);

    console.log(response.data);
    
    let formattedEvents = getFormattedEvents(response.data);
  
    console.log(formattedEvents);

    return formattedEvents;

  } catch (error) {
    console.error("Error fetching schedule:", error);
    return [];
  }
}

export async function getTeamSchedule(team_id: number): Promise<Event[]> {
  try {
    const response = await axios.post(`http://${APIHOST}/schedule/get_team_games`, {team_id: team_id}); 

    console.log(response.data);
    
    let formattedEvents = getFormattedEvents(response.data);
  
    console.log(formattedEvents);

    return formattedEvents;

  } catch (error) {
    console.error("Error fetching schedule:", error);
    return [];
  }
}

export async function genSampleSchedule(num_games: number): Promise<GenSchedResponse> {
  try {
    // Currently the input is a placeholder
    const response = await axios.post(`http://${APIHOST}/schedule/gen_schedule`, {num_games: num_games}); 

    console.log(response.data);
    const games = convertSchedData(response.data.schedule, response.data.teams);
    const events = getFormattedEvents(games);
    console.log(events);

    return {events: events, schedule: response.data.schedule, score: response.data.score};
  } catch (error)  {
    console.error("Error generating schedule:", error);
    return {events:[], schedule:{}, score: 0};
  }
}

function convertSchedData(schedule: Dictionary, teams: Dictionary) : Game[] {
  const games: Game[] = [];
  // Response is a dictionary with keys being gameslots and values being lists of two teams.
  // Loop through each key and value of response:
  for (const key in schedule) {
    if (schedule.hasOwnProperty(key)) {
      const game_teams = schedule[key];      
      // Create a new game object with the date, time, field, and team names.
      const game: Game = {
        id: 0,
        field: key.split(",")[0],
        time: key.split(",")[1],
        date: key.split(",")[2],
        home_team_name: teams[game_teams[0]]["name"],
        home_team_id: teams[game_teams[0]]["id"],
        away_team_name: teams[game_teams[1]]["name"],
        away_team_id: teams[game_teams[1]]["id"]
      };
      // Add the game object to the games array.
      games.push(game);
    }
  }
  
  return games;
}

function getFormattedEvents(games: any) : Event[] {
  var eventsTemp: { [key: string]: Event} = {}

  for (const game of games) {
    var dateTime : string = game.date + game.time;

    // If the event doesn't exist, initialize it with start and end dates
    if (!(dateTime in eventsTemp)) {
      // Split the date string into components
      var start = new Date(game.date);
      var end = new Date(game.date);
      if (game.time === "1") {
        start.setUTCHours(21, 0, 0);
        end.setUTCHours(22, 30, 0);
      } else if (game.time === "2") {
        start.setUTCHours(22, 30, 0);
        end.setUTCHours(24, 0, 0);
      } else if (game.time === "3") {
        start.setUTCHours(24, 0, 0);
        end.setUTCHours(25, 30, 0);
      } else if (game.time === "4") {
        start.setUTCHours(25, 30, 0);
        end.setUTCHours(29, 0, 0);
      }
      eventsTemp[dateTime] = {
        start: start,
        end: end,
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
    console.log(startDate)
    startDate.setHours(17);
    startDate.setMinutes(0);

    let eventExists = events.some(event => event.start.getTime() === startDate.getTime());

    if (!eventExists) {
      events.push({
        start: new Date(startDate),
        end: new Date(startDate.setHours(startDate.getHours() + 1, 30)),
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
        end: end,
      });
    }

    startDate.setHours(20);
    startDate.setMinutes(0);

    eventExists = events.some(event => event.start.getTime() === startDate.getTime());

    if (!eventExists) {
      events.push({
        start: new Date(startDate),
        end: new Date(startDate.setHours(startDate.getHours() + 1, 30)),
      });
    }

    startDate.setDate(startDate.getDate() + 1);
  }

  return events;
}
