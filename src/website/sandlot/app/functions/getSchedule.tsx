import axios from "axios";
import { Dictionary, findElements } from "@fullcalendar/core/internal";

import { Event, GenSchedResponse } from "../types";
import getSolsticeSettings from "./getSolsticeSettings";

const seasonStart = new Date("2025-05-05");
const seasonEnd = new Date("2025-08-20");

const dayStart = 21;
const dayEnd = 27;

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

interface Timeslot {
  start_hour: number;
  start_minutes: number;
  end_hour: number;
  end_minutes: number;
}

interface SolsticeSettings {
  active: boolean;
  start: string;
  end: string;
}

interface Field {
  timeslots: Record<string, Timeslot>;
}

// const dynamicSolstice: boolean = true;
// const solsticeStart: Date = new Date("2025-06-21T00:00:00");
// const solsticeEnd: Date = new Date("2025-09-23T00:00:00");

const nonSolsticeTimeslots: Record<string, Field> = {
  "1": {
    timeslots: {
      "1": {
        start_hour: 21,
        start_minutes: 0,
        end_hour: 22,
        end_minutes: 30,
      },
      "2": {
        start_hour: 22,
        start_minutes: 30,
        end_hour: 24,
        end_minutes: 0,
      },
    },
  },
  "2": {
    timeslots: {
      "1": {
        start_hour: 21,
        start_minutes: 0,
        end_hour: 22,
        end_minutes: 30,
      },
      "2": {
        start_hour: 22,
        start_minutes: 30,
        end_hour: 24,
        end_minutes: 0,
      },
    },
  },
  "3": {
    timeslots: {
      "1": {
        start_hour: 21,
        start_minutes: 0,
        end_hour: 22,
        end_minutes: 30,
      },
      "2": {
        start_hour: 22,
        start_minutes: 30,
        end_hour: 24,
        end_minutes: 0,
      },
      "3": {
        start_hour: 24,
        start_minutes: 0,
        end_hour: 25,
        end_minutes: 30,
      },
      "4": {
        start_hour: 25,
        start_minutes: 30,
        end_hour: 27,
        end_minutes: 0,
      },
    },
  },
}

export default async function getSchedule(timeslots: any): Promise<Event[]> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APIHOST}/schedule/get_all_games`,
    );

    console.log("Response:", response.data);
    
    const solsticeSettings = await getSolsticeSettings();

    const formattedEvents = getFormattedEvents(response.data, timeslots, solsticeSettings);
    const eventsWithSpacers = addSpacerEventsUsingFields(formattedEvents, timeslots, solsticeSettings);

    console.log("Formatted Events:",formattedEvents);
    console.log("Formatted Events with Spacers:",eventsWithSpacers);

    return eventsWithSpacers;
  } catch (error) {
    console.error("Error fetching schedule:", error);

    return [];
  }
}

export async function getTeamSchedule(team_id: number, timeslots: any): Promise<Event[]> {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APIHOST}/schedule/get_team_games`,
      { team_id: team_id },
    );

    console.log("Response:", response.data);

    const solsticeSettings = await getSolsticeSettings();

    const formattedEvents = getFormattedEvents(response.data, timeslots, solsticeSettings);

    console.log("Team Formatted Events:", formattedEvents);

    return formattedEvents;
  } catch (error) {
    console.error("Error fetching schedule:", error);

    return [];
  }
}

export async function genSampleSchedule(
  num_games: number, timeslots: any,
): Promise<GenSchedResponse> {
  try {
    // Currently the input is a placeholder
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APIHOST}/schedule/gen_schedule`,
      { num_games: num_games },
    );

    console.log(response.data);

    const solsticeSettings = await getSolsticeSettings();

    const games = convertSchedData(response.data.schedule, response.data.teams);
    const formattedEvents = getFormattedEvents(games, timeslots, solsticeSettings);
    const eventsWithSpacers = addSpacerEventsUsingFields(formattedEvents, timeslots, solsticeSettings);

    console.log("Formatted Events:",formattedEvents);
    console.log("Formatted Events with Spacers:",eventsWithSpacers);

    return {
      events: eventsWithSpacers,
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

function getFormattedEvents(games: any, timeslots: any, solsticeSettings: SolsticeSettings): Event[] {
  const formattedEvents: Event[] = [];

  const solsticeStart = new Date(solsticeSettings.start);
  const solsticeEnd = new Date(solsticeSettings.end);
  
  // Determine the fields based on dynamicSolstice or timeslots
  const fields: Record<string, Field> = solsticeSettings.active
    ? nonSolsticeTimeslots
    : timeslots.length > 0
    ? buildFieldsFromTimeslots(timeslots)
    : nonSolsticeTimeslots;

  for (const game of games) {
    // Split the date string into components
    var start = new Date(game.date);
    var end = new Date(game.date);

    // Use the `fields` object to dynamically set the start and end times
    const timeslot = fields[game.field]?.timeslots[game.time];
    if (timeslot) {
      start.setUTCHours(timeslot.start_hour, timeslot.start_minutes, 0);
      end.setUTCHours(timeslot.end_hour, timeslot.end_minutes, 0);
    } else {
      console.warn(`Timeslot not found for field ${game.field} and time ${game.time}`);
      continue; // Skip this game if the timeslot is not defined
    }

    // If using dynamicSolstice, and the start time is within the solstice date range,
    // if on field 1 or 2, the start and end hours are pushed forward by 1.
    if (solsticeSettings.active && start >= solsticeStart && start <= solsticeEnd) {
      if (game.field === "1" || game.field === "2") {
        start.setUTCHours(start.getUTCHours() + 1);
        end.setUTCHours(end.getUTCHours() + 1);
      }
    }

    var formattedEvent: Event = {
      start: start,
      end: end,
      field: game.field,
      timeslot: game.time,
      game_id: game.id,
      home: game.home_team_name,
      home_id: game.home_team_id,
      home_score: game.home_team_score,
      away: game.away_team_name,
      away_id: game.away_team_id,
      away_score: game.away_team_score,
      played: game.played,
      forfeit: game.forfeit,
      spacer: false,
    }

    formattedEvents.push(formattedEvent)
  }

  return formattedEvents
}

export function addSpacerEventsUsingFields(events: Event[], timeslots: any, solsticeSettings: SolsticeSettings): Event[] {
  const fieldsToFill = ["1", "2", "3"]; // Fields 1 to 3

  const solsticeStart = new Date(solsticeSettings.start);
  const solsticeEnd = new Date(solsticeSettings.end);

  // Calculate earliest start and latest end
  const earliest = Math.min(...timeslots.map((ts: any) => parseInt(ts.start.split("-")[0])));
  const latest = Math.max(...timeslots.map((ts: any) => {
    const [hour, minute] = ts.end.split("-").map(Number); // Extract hour and minute
    return minute > 0 ? hour + 1 : hour; // Round up if there are minutes
  }));

  // Determine the fields based on dynamicSolstice or timeslots
  const fields: Record<string, Field> = solsticeSettings.active
    ? nonSolsticeTimeslots
    : timeslots.length > 0
    ? buildFieldsFromTimeslots(timeslots)
    : nonSolsticeTimeslots;

  // Iterate over each field
  for (const field of fieldsToFill) {
    const fieldTimeslots = fields[field]?.timeslots;

    if (!fieldTimeslots) {
      console.warn(`No timeslots defined for field ${field}`);
      continue;
    }

    // Iterate over each day in the season
    let currentDate = new Date(seasonStart);
    while (currentDate <= seasonEnd) {
      // Skip weekends
      if (currentDate.getDay() === 5 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      // Get the first and last timeslot for the current field
      const timeslotKeys = Object.keys(fieldTimeslots).sort();
      const firstTimeslot = fieldTimeslots[timeslotKeys[0]];
      const lastTimeslot = fieldTimeslots[timeslotKeys[timeslotKeys.length - 1]];

      // Add spacer from 5:00 to the start of the first timeslot
      const startOfDay = new Date(currentDate);
      startOfDay.setUTCHours(earliest, 0, 0);

      const startOfFirstTimeslot = new Date(currentDate);
      startOfFirstTimeslot.setUTCHours(firstTimeslot.start_hour, firstTimeslot.start_minutes, 0);

      // Adjust for solstice if applicable
      if (solsticeSettings.active && currentDate >= solsticeStart && currentDate <= solsticeEnd) {
        if (field === "1" || field === "2") {
          startOfFirstTimeslot.setUTCHours(startOfFirstTimeslot.getUTCHours() + 1);
        }
      }

      // Only add a spacer if the first timeslot does not start at 5:00
      if (startOfFirstTimeslot.getTime() > startOfDay.getTime()) {
        const spacerBeforeExists = events.some(
          (event) =>
            event.start.getTime() === startOfDay.getTime() &&
            event.end.getTime() === startOfFirstTimeslot.getTime() &&
            event.field === field,
        );

        if (!spacerBeforeExists) {
          events.push({
            start: startOfDay,
            end: startOfFirstTimeslot,
            field: field,
            timeslot: undefined,
            game_id: undefined,
            home: undefined,
            home_id: undefined,
            home_score: undefined,
            away: undefined,
            away_id: undefined,
            away_score: undefined,
            played: false,
            forfeit: undefined,
            spacer: true,
          });
        }
      }

      // Add spacer from the end of the last timeslot to 11:00
      const endOfLastTimeslot = new Date(currentDate);
      endOfLastTimeslot.setUTCHours(lastTimeslot.end_hour, lastTimeslot.end_minutes, 0);

      const endOfDay = new Date(currentDate);
      endOfDay.setUTCHours(latest, 0, 0);

      // Adjust for solstice if applicable
      if (solsticeSettings.active && currentDate >= solsticeStart && currentDate <= solsticeEnd) {
        if (field === "1" || field === "2") {
          endOfLastTimeslot.setUTCHours(endOfLastTimeslot.getUTCHours() + 1);
        }
      }

      const spacerAfterExists = events.some(
        (event) =>
          event.start.getTime() === endOfLastTimeslot.getTime() &&
          event.end.getTime() === endOfDay.getTime() &&
          event.field === field,
      );

      if (!spacerAfterExists) {
        events.push({
          start: endOfLastTimeslot,
          end: endOfDay,
          field: field,
          timeslot: undefined,
          game_id: undefined,
          home: undefined,
          home_id: undefined,
          home_score: undefined,
          away: undefined,
          away_id: undefined,
          away_score: undefined,
          played: false,
          forfeit: undefined,
          spacer: true,
        });
      }

      // Iterate over each timeslot for the current field
      for (const timeKey in fieldTimeslots) {
        if (fieldTimeslots.hasOwnProperty(timeKey)) {
          const timeslot = fieldTimeslots[timeKey];

          const start = new Date(currentDate);
          start.setUTCHours(timeslot.start_hour, timeslot.start_minutes, 0);

          const end = new Date(currentDate);
          end.setUTCHours(timeslot.end_hour, timeslot.end_minutes, 0);

          // Adjust for solstice if applicable
          if (solsticeSettings.active && currentDate >= solsticeStart && currentDate <= solsticeEnd) {
            if (field === "1" || field === "2") {
              start.setUTCHours(start.getUTCHours() + 1);
              end.setUTCHours(end.getUTCHours() + 1);
            }
          }

          // Check if an event already exists for this field, date, and timeslot
          const eventExists = events.some(
            (event) =>
              event.start.getUTCFullYear() === start.getUTCFullYear() &&
              event.start.getUTCMonth() === start.getUTCMonth() &&
              event.start.getUTCDate() === start.getUTCDate() &&
              event.start.getUTCHours() === start.getUTCHours() &&
              event.start.getUTCMinutes() === start.getUTCMinutes() &&
              event.field === field,
          );

          // If no event exists, add a spacer event
          if (!eventExists) {
            events.push({
              start: start,
              end: end,
              field: field,
              timeslot: timeKey,
              game_id: undefined,
              home: "spacer",
              home_id: undefined,
              home_score: undefined,
              away: "spacer",
              away_id: undefined,
              away_score: undefined,
              played: false,
              forfeit: undefined,
              spacer: true, // Mark this as a spacer event
            });
          }
        }
      }

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return events;
}

function buildFieldsFromTimeslots(timeslots: any): Record<string, Field> {
  const fields: Record<string, Field> = {};
  const fieldCounters: Record<string, number> = {}; // Track counters for each field

  // Group timeslots by field_id
  const groupedTimeslots: Record<string, any[]> = {};
  for (const timeslot of timeslots) {
    const fieldId = timeslot.field_id.toString();
    if (!groupedTimeslots[fieldId]) {
      groupedTimeslots[fieldId] = [];
    }
    groupedTimeslots[fieldId].push(timeslot);
  }

  // Process each field's timeslots
  for (const fieldId in groupedTimeslots) {
    if (groupedTimeslots.hasOwnProperty(fieldId)) {
      // Sort timeslots by start time (hour and minute)
      groupedTimeslots[fieldId].sort((a, b) => {
        const [aStartHour, aStartMinute] = a.start.split("-").map(Number);
        const [bStartHour, bStartMinute] = b.start.split("-").map(Number);
        return aStartHour - bStartHour || aStartMinute - bStartMinute;
      });

      // Initialize the field and counter
      fields[fieldId] = { timeslots: {} };
      fieldCounters[fieldId] = 1;

      // Assign sorted timeslots to the field
      for (const timeslot of groupedTimeslots[fieldId]) {
        const [startHour, startMinute] = timeslot.start.split("-").map(Number);
        const [endHour, endMinute] = timeslot.end.split("-").map(Number);

        const timeslotKey = fieldCounters[fieldId].toString();
        fields[fieldId].timeslots[timeslotKey] = {
          start_hour: startHour,
          start_minutes: startMinute,
          end_hour: endHour,
          end_minutes: endMinute,
        };

        fieldCounters[fieldId]++;
      }
    }
  }

  console.log("Fields: ", fields);

  return fields;
}

// export function addEmptyEvents(events: Event[], currDate: Date): Event[] {
//   if (currDate > seasonEnd) {
//     return events;
//   }

//   let dateCount: Date;

//   if (currDate > seasonStart) {
//     dateCount = currDate;
//   } else {
//     dateCount = seasonStart;
//   }
//   // for (let eventya of events) {
//   //   if (eventya.start.getUTCDate() === 23) {
//   //     console.log("23th ", eventya);
//   //   }
//   // }

//   while (dateCount < seasonEnd) {
//     // Skip weekends
//     if (dateCount.getDay() === 5 || dateCount.getDay() === 6) {
//       dateCount.setDate(dateCount.getDate() + 1);
//       continue;
//     }
//     // console.log(dateCount);
//     let startDate = new Date(dateCount);
//     startDate.setUTCHours(21, 0, 0);

//     // console.log("Test start: ", startDate);
//     // console.log("Date: ", startDate.getUTCDate());
//     // console.log("Hours: ", startDate.getUTCHours());

//     let eventExists = events.some(
//       (event) => (
//         event.start.getUTCFullYear() === startDate.getUTCFullYear()
//         && event.start.getUTCMonth() === startDate.getUTCMonth()
//         && event.start.getUTCDate() === startDate.getUTCDate()
//         && event.start.getUTCHours() === startDate.getUTCHours()
//       ),
//     );

//     console.log("Event exists: ", eventExists);

//     if (!eventExists) {
//       let end = new Date(startDate);
//       end.setUTCHours(end.getUTCHours() + 1);
//       end.setUTCMinutes(end.getUTCMinutes() + 30);
//       events.push({
//         start: new Date(startDate),
//         end: end,
//       });
//     }

//     startDate.setUTCHours(22, 30, 0);

//     eventExists = events.some(
//       (event) => (
//         event.start.getUTCFullYear() === startDate.getUTCFullYear()
//         && event.start.getUTCMonth() === startDate.getUTCMonth()
//         && event.start.getUTCDate() === startDate.getUTCDate()
//         && event.start.getUTCHours() === startDate.getUTCHours()
//       ),
//     );

//     if (!eventExists) {
//       let end = new Date(startDate);
//       end.setUTCHours(end.getUTCHours() + 1);
//       end.setUTCMinutes(end.getUTCMinutes() + 30);
//       events.push({
//         start: new Date(startDate),
//         end: end,
//       });
//     }

//     startDate.setUTCHours(24, 0, 0);

//     eventExists = events.some(
//       (event) => (
//         event.start.getUTCFullYear() === startDate.getUTCFullYear()
//         && event.start.getUTCMonth() === startDate.getUTCMonth()
//         && event.start.getUTCDate() === startDate.getUTCDate()
//         && event.start.getUTCHours() === startDate.getUTCHours()
//       ),
//     );

//     if (!eventExists) {
//       let end = new Date(startDate);
//       end.setUTCHours(end.getUTCHours() + 1);
//       end.setUTCMinutes(end.getUTCMinutes() + 30);
//       events.push({
//         start: new Date(startDate),
//         end: end,
//       });
//     }

//     startDate.setUTCHours(1, 30, 0);

//     eventExists = events.some(
//       (event) => (
//         event.start.getUTCFullYear() === startDate.getUTCFullYear()
//         && event.start.getUTCMonth() === startDate.getUTCMonth()
//         && event.start.getUTCDay() === startDate.getUTCDay()
//         && event.start.getUTCDate() === startDate.getUTCDate()
//         && event.start.getUTCHours() === startDate.getUTCHours()
//       ),
//     );

//     if (!eventExists) {
//       let end = new Date(startDate);
//       end.setUTCHours(end.getUTCHours() + 1);
//       end.setUTCMinutes(end.getUTCMinutes() + 30);
//       events.push({
//         start: new Date(startDate),
//         end: end,
//       });
//     }

//     dateCount.setDate(dateCount.getDate() + 1);
//   }

//   return events;
// }
