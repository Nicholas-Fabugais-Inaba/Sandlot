import axios from "axios";
import { Dictionary } from "@fullcalendar/core/internal";

import { Event, GenSchedResponse } from "../types";

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
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APIHOST}/schedule/get_all_games`,
    );

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
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APIHOST}/schedule/get_team_games`,
      { team_id: team_id },
    );

    console.log(response.data);

    let formattedEvents = getFormattedEvents(response.data);

    console.log(formattedEvents);

    return formattedEvents;
  } catch (error) {
    console.error("Error fetching schedule:", error);

    return [];
  }
}

export async function genSampleSchedule(
  num_games: number,
): Promise<GenSchedResponse> {
  try {
    // Currently the input is a placeholder
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APIHOST}/schedule/gen_schedule`,
      { num_games: num_games },
    );

    console.log(response.data);
    const games = convertSchedData(response.data.schedule, response.data.teams);
    const events = getFormattedEvents(games);

    console.log(events);

    return {
      events: events,
      schedule: response.data.schedule,
      score: response.data.score,
    };
  } catch (error) {
    console.error("Error generating schedule:", error);

    return { events: [], schedule: {}, score: 0 };
  }
}

function convertSchedData(schedule: Dictionary, teams: Dictionary): Game[] {
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
        away_team_id: teams[game_teams[1]]["id"],
      };

      // Add the game object to the games array.
      games.push(game);
    }
  }

  return games;
}

function getFormattedEvents(games: any): Event[] {
  var eventsTemp: { [key: string]: Event } = {};

  for (const game of games) {
    var dateTime: string = game.date + game.time;

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
        end.setUTCHours(27, 0, 0);
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
          home_score: game.home_team_score,
          away: game.away_team_name,
          away_id: game.away_team_id,
          away_score: game.away_team_score,
          played: game.played,
          forfeit: game.forfeit,
        },
      };
    } else if (game.field === "2") {
      eventsTemp[dateTime] = {
        ...eventsTemp[dateTime],
        field2: {
          id: game.id,
          home: game.home_team_name,
          home_id: game.home_team_id,
          home_score: game.home_team_score,
          away: game.away_team_name,
          away_id: game.away_team_id,
          away_score: game.away_team_score,
          played: game.played,
          forfeit: game.forfeit,
        },
      };
    } else if (game.field === "3") {
      eventsTemp[dateTime] = {
        ...eventsTemp[dateTime],
        field3: {
          id: game.id,
          home: game.home_team_name,
          home_id: game.home_team_id,
          home_score: game.home_team_score,
          away: game.away_team_name,
          away_id: game.away_team_id,
          away_score: game.away_team_score,
          played: game.played,
          forfeit: game.forfeit,
        },
      };
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

export function addEmptyEvents(events: Event[], currDate: Date): Event[] {
  if (currDate > seasonEnd) {
    return events;
  }

  let dateCount: Date;

  if (currDate > seasonStart) {
    dateCount = currDate;
  } else {
    dateCount = seasonStart;
  }
  // for (let eventya of events) {
  //   if (eventya.start.getUTCDate() === 23) {
  //     console.log("23th ", eventya);
  //   }
  // }

  while (dateCount < seasonEnd) {
    // Skip weekends
    if (dateCount.getDay() === 5 || dateCount.getDay() === 6) {
      dateCount.setDate(dateCount.getDate() + 1);
      continue;
    }
    // console.log(dateCount);
    let startDate = new Date(dateCount);
    startDate.setUTCHours(21, 0, 0);

    // console.log("Test start: ", startDate);
    // console.log("Date: ", startDate.getUTCDate());
    // console.log("Hours: ", startDate.getUTCHours());

    let eventExists = events.some(
      (event) => (
        event.start.getUTCFullYear() === startDate.getUTCFullYear()
        && event.start.getUTCMonth() === startDate.getUTCMonth()
        && event.start.getUTCDate() === startDate.getUTCDate()
        && event.start.getUTCHours() === startDate.getUTCHours()
      ),
    );

    console.log("Event exists: ", eventExists);

    if (!eventExists) {
      let end = new Date(startDate);
      end.setUTCHours(end.getUTCHours() + 1);
      end.setUTCMinutes(end.getUTCMinutes() + 30);
      events.push({
        start: new Date(startDate),
        end: end,
      });
    }

    startDate.setUTCHours(22, 30, 0);

    eventExists = events.some(
      (event) => (
        event.start.getUTCFullYear() === startDate.getUTCFullYear()
        && event.start.getUTCMonth() === startDate.getUTCMonth()
        && event.start.getUTCDate() === startDate.getUTCDate()
        && event.start.getUTCHours() === startDate.getUTCHours()
      ),
    );

    if (!eventExists) {
      let end = new Date(startDate);
      end.setUTCHours(end.getUTCHours() + 1);
      end.setUTCMinutes(end.getUTCMinutes() + 30);
      events.push({
        start: new Date(startDate),
        end: end,
      });
    }

    startDate.setUTCHours(24, 0, 0);

    eventExists = events.some(
      (event) => (
        event.start.getUTCFullYear() === startDate.getUTCFullYear()
        && event.start.getUTCMonth() === startDate.getUTCMonth()
        && event.start.getUTCDate() === startDate.getUTCDate()
        && event.start.getUTCHours() === startDate.getUTCHours()
      ),
    );

    if (!eventExists) {
      let end = new Date(startDate);
      end.setUTCHours(end.getUTCHours() + 1);
      end.setUTCMinutes(end.getUTCMinutes() + 30);
      events.push({
        start: new Date(startDate),
        end: end,
      });
    }

    startDate.setUTCHours(1, 30, 0);

    eventExists = events.some(
      (event) => (
        event.start.getUTCFullYear() === startDate.getUTCFullYear()
        && event.start.getUTCMonth() === startDate.getUTCMonth()
        && event.start.getUTCDay() === startDate.getUTCDay()
        && event.start.getUTCDate() === startDate.getUTCDate()
        && event.start.getUTCHours() === startDate.getUTCHours()
      ),
    );

    if (!eventExists) {
      let end = new Date(startDate);
      end.setUTCHours(end.getUTCHours() + 1);
      end.setUTCMinutes(end.getUTCMinutes() + 30);
      events.push({
        start: new Date(startDate),
        end: end,
      });
    }

    dateCount.setDate(dateCount.getDate() + 1);
  }

  return events;
}
