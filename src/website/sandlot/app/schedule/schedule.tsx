// app/schedule/schedule.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { getSession, signOut, signIn } from "next-auth/react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, user, Spinner } from "@heroui/react"; // Import NextUI Card

import "./SchedulePage.css"; // Custom styles
import { Dictionary } from "@fullcalendar/core/internal";

import getSchedule, {
  genSampleSchedule,
  getTeamSchedule,
} from "../functions/getSchedule";
import { Event, GenSchedResponse } from "../types";
import createRR from "../functions/createRR";
import saveSchedule from "../functions/saveSchedule";
import getScore from "../functions/getScore";
import submitScore from "../functions/submitScore";
import commissionerReschedule from "../functions/commissionerReschedule";

import { useSchedule } from "./ScheduleContext";

import { title } from "@/components/primitives";
import getPlayerActiveTeam from "../functions/getPlayerActiveTeam";
import getAllTimeslots from "../functions/getAllTimeslots";

const currDate = new Date();

currDate.setDate(currDate.getDate() + 61);
// currDate.setHours(currDate.getHours() - 1);
console.log(currDate);
const currNextDate = new Date(currDate);

currNextDate.setDate(currDate.getDate() + 1);

interface SelectedDate {
  date: Date;
  field: number;
}

interface RescheduleGame {
  game_id: number;
  date: Date;
  field: number;
  home_id: number;
  away_id: number;
}

interface GameScore {
  game_id: number;
  played: boolean;
  date: Date;
  home_score: number;
  home_name: string;
  away_score: number;
  away_name: string;
  forfeit: number;
}

interface ScheduleProps {
  viewer?: boolean;
  setUnsavedChanges?: (hasChanges: boolean) => void;
}

export default function Schedule({ viewer, setUnsavedChanges }: ScheduleProps) {
  const context = useSchedule();
  const [events, setEvents] =
    context && context.events
      ? [context.events, context.setEvents]
      : useState<Event[]>();
  const [schedule, setSchedule] =
    context && context.schedule
      ? [context.schedule, context.setSchedule]
      : useState<Dictionary>({});
  const [schedScore, setSchedScore] =
    context && context.schedScore
      ? [context.schedScore, context.setSchedScore]
      : useState<number>(0);
  const [view, setView] = useState("timeGridWeek");
  const [selectedDates, setSelectedDates] = useState<SelectedDate[]>([]);
  const [rescheduleGame, setRescheduleGame] = useState<RescheduleGame>();
  const [gameScore, setGameScore] = useState<GameScore>();
  const [homeTeamForfeit, setHomeTeamForfeit] = useState(false);
  const [awayTeamForfeit, setAwayTeamForfeit] = useState(false);
  const [showNoticeCheckbox, setShowNoticeCheckbox] = useState(false);
  const [noticeChecked, setNoticeChecked] = useState(false);
  const [submitScoreVisible, setSubmitScoreVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<number>(0);
  const [teamName, setTeamName] = useState<string>("team_name");
  const [loading, setLoading] = useState(true);
  const [schedType, setSchedType] = useState(0); // 0 = Full Schedule, 1 = Team Schedule, 2 = Choose game to reschedule, 3 = Choose alternative game days
  const [maxSelectedDates, setMaxSelectedDates] = useState(5); // Maximum number of dates that can be selected when rescheduling games
  const [timeslots, setTimeslots] = useState([]);

  // Fetch session data to get user role and team (if player or team account)
  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true); // Set loading to true at the start of fetching
      try {
        const session = await getSession();
        const timeslots = await getAllTimeslots();
        if (timeslots) {
          setTimeslots(timeslots);
        }

        if (session) {
          setUserRole(session.user?.role || null);

          // Adjust schedule type based on user role
          if (session.user?.role === "player" || session.user?.role === "team") {
            setSchedType(1);
            setView("dayGridMonth");
            if (calendarRef.current) {
              calendarRef.current.getApi().changeView("dayGridMonth");
            }
            // Set team id
            let teamId = 0
            let teamName = ""
            if (session.user.role === "player") {
              const teamData = await getPlayerActiveTeam(session?.user.id)
              teamId = teamData.team_id
              teamName = teamData.team_name
            } else if (session.user.role === "team") {
              teamId = session.user.id
              teamName = session.user.teamName
            }
            setTeamId(teamId)
            setTeamName(teamName)
  
            // Fetch team schedule
            const formattedEvents = await getTeamSchedule(teamId, timeslots);
            setEvents(formattedEvents);
          } else if (
            session.user?.role === "commissioner" ||
            session.user?.role === "role"
          ) {
            setSchedType(0);
            setMaxSelectedDates(1);
  
            // Fetch full schedule
            const formattedEvents = await getSchedule(timeslots);
            setEvents(formattedEvents);
          }
        } else {
          // Fetch default schedule if no session
          const formattedEvents = await getSchedule(timeslots);
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
        // Optionally set a default or empty events array
        setEvents([]);
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };
  
    fetchSession();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        closePopup();
      }
    };

    if (popupVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupVisible]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelectClick = (start: Date | null, field: number) => {
    if (start) {
      const isDuplicate = selectedDates.some(
        (selectedDate) =>
          selectedDate.date.getTime() === start.getTime() &&
          selectedDate.field === field,
      );
  
      if (isDuplicate) {
        const newSelectedDates = selectedDates.filter(
          (selectedDate) =>
            !(
              selectedDate.date.getTime() === start.getTime() &&
              selectedDate.field === field
            ),
        );
  
        setSelectedDates(newSelectedDates);
      } else {
        let newSelectedDates = [...selectedDates, { date: start, field }];
  
        if (newSelectedDates.length > maxSelectedDates) {
          newSelectedDates = newSelectedDates.slice(1); // Remove the first selected date
        }
  
        setSelectedDates(newSelectedDates);
      }
    }
  };

  const handleTeamClick = async (
    event: React.MouseEvent,
    date: Date | null,
    field: number,
    game: any,
  ) => {
    // If the user is either a commissioner or the game selected is one the logged in team is playing in
    if (
      date &&
      !viewer &&
      (userRole === "commissioner" ||
        (userRole === "team" &&
          (game.home_id === teamId || game.away_id === teamId)))
    ) {
      setPopupPosition({ x: event.pageX, y: event.pageY });
      setPopupVisible(true);
      setRescheduleGame({
        game_id: game.game_id,
        date: date,
        field: field,
        home_id: game.home_id,
        away_id: game.away_id,
      });

      // Set inital attributes while getScore is loading.
      setGameScore({
        game_id: game.game_id,
        played: true,
        date: new Date,
        home_score: 0,
        home_name: "",
        away_score: 0,
        away_name: "",
        forfeit: 0,
      });

      await getScore(game.game_id).then(
        (res) => {
          setGameScore({
            game_id: game.game_id,
            played: game.played,
            date: date,
            home_score: res.home_team_score,
            home_name: game.home,
            away_score: res.away_team_score,
            away_name: game.away,
            forfeit: res.forfeit ? res.forfeit : 0,
          });
        },
        (err) => {
          console.error(err);
        },
      );
    }
  };

  const handleSubmitScoreClick = () => {
    setSubmitScoreVisible(true);
    setPopupVisible(false);
  
    // Reset forfeit states and notice checkbox
    setHomeTeamForfeit(false);
    setAwayTeamForfeit(false);
    setShowNoticeCheckbox(false);
    setNoticeChecked(false);
  };
  
  
  const handleScoreSubmit = async () => {
    if (gameScore) {
      // Determine forfeit status
      let forfeitStatus = 0;
      let homeScore = gameScore.home_score;
      let awayScore = gameScore.away_score;
  
      if (homeTeamForfeit) {
        forfeitStatus = 1;
        homeScore = noticeChecked ? 1 : 0;
        awayScore = 9; // 9-1 if notice checked, otherwise 9-0
      } else if (awayTeamForfeit) {
        forfeitStatus = 2;
        homeScore = 9; // 9-1 if notice checked, otherwise 9-0
        awayScore = noticeChecked ? 1 : 0;
      }      
  
      // Prepare submission data
      const submissionData = {
        game_id: gameScore.game_id,
        home_score: homeScore,
        away_score: awayScore,
        forfeit: forfeitStatus
      };
  
      try {
        await submitScore(submissionData);
  
        // Fetch event data to reflect the changes
        let updatedEvents;
        if (userRole === "team") {
          if (teamId && view === "dayGridMonth") {
            updatedEvents = await getTeamSchedule(teamId, timeslots);
          } else {
            updatedEvents = await getSchedule(timeslots);
          }
        } else {
          updatedEvents = await getSchedule(timeslots);
        }
  
        setEvents(updatedEvents);
        setSubmitScoreVisible(false);
      } catch (error) {
        console.error("Error submitting score:", error);
        // Optionally, show an error message to the user
      }
    }
  };  

  const handleScoreCancel = () => {
    setSubmitScoreVisible(false);
  };

  const handleRescheduleClick = () => {
    // if (rescheduleGame && rescheduleGame?.date < currDate) {
    //   return;
    // }
    setSchedType(3);
    setLoading(true);
    setView("timeGridWeek");
    (async () => {
      let formattedEvents = await getSchedule(timeslots);

      // TODO: fix this
      // formattedEvents = addEmptyEvents(formattedEvents, currDate);
      console.log("Here", formattedEvents);
      setEvents(formattedEvents);
    })();
    setPopupVisible(false);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView("timeGridWeek"); // Force calendar to change view
    }
    setLoading(false);
  };

  const handleReturnClick = () => {
    if (userRole === "player" || userRole === "team") {
      setSchedType(1);
      setLoading(true);
      (async () => {
        let formattedEvents = await getTeamSchedule(teamId ? teamId : 0, timeslots);
        setEvents(formattedEvents);
      })();
      setView("dayGridMonth");
      if (calendarRef.current) {
        calendarRef.current.getApi().changeView("dayGridMonth"); // Force calendar to change view
      }
      setLoading(false);
    } else {
      setSchedType(0);
      setLoading(true);
      (async () => {
        let formattedEvents = await getSchedule(timeslots);
        setEvents(formattedEvents);
      })();
      setLoading(false);
    }
  };

  const handleGenerateSchedule = () => {
    // Implement the logic to generate the schedule
    console.log("Generate Schedule button clicked");

    if (setUnsavedChanges) {
      setUnsavedChanges(true)
    }

    // Set events to a schedule generated by the backend
    (async () => {
      console.log("generating schedule...")
      let sampleSched = await genSampleSchedule(20, timeslots);

      console.log("schedule generated.")
      setEvents(sampleSched.events);
      console.log("events set")
      setSchedule(sampleSched.schedule);
      setSchedScore(sampleSched.score);
    })();
  };

  const handleSubmitSchedule = () => {
    // Implement the logic to submit the schedule
    console.log("Submit Schedule button clicked");
    console.log(schedule);
    saveSchedule(schedule);
    if (setUnsavedChanges) {
      setUnsavedChanges(false);
    }
  };

  const handleCommissionerReschedule = () => {
    console.log(
      "Commissioner submit reschedule: ",
      selectedDates[0],
      " to reschedule game: ",
      rescheduleGame,
    );
    if (rescheduleGame && selectedDates[0]) {
      const formattedDate: string = selectedDates[0].date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
      commissionerReschedule({
        game_id: rescheduleGame?.game_id,
        date: formattedDate,
        time: deriveTimeslot(selectedDates[0].date),
        field: selectedDates[0].field.toString()
      })
    }

    // setTimeout is used to wait for the db to be populated with the rescheduled game before attempting to retrieve the game information on the schedule page
    setTimeout(() => {
      handleReturnClick()
    }, 1000)
  };

  const isSelected = (start: Date | null, field: number) => {
    return start
      ? selectedDates.some(
          (selectedDate) =>
            selectedDate.date.getTime() === start.getTime() &&
            selectedDate.field === field,
        )
      : false;
  };

  const handleSendRequest = async () => {
    handleReturnClick();
    const RRdata = {
      requester_id: teamId,
      receiver_id:
        rescheduleGame?.home_id === teamId
          ? rescheduleGame?.away_id
          : rescheduleGame?.home_id,
      game_id: rescheduleGame?.game_id,
      option1: selectedDates[0]?.date.toISOString() || "",
      option2: selectedDates[1]?.date.toISOString() || "",
      option3: selectedDates[2]?.date.toISOString() || "",
      option4: selectedDates[3]?.date.toISOString() || "",
      option5: selectedDates[4]?.date.toISOString() || "",
      option1_field: selectedDates[0]?.field.toString() || "",
      option2_field: selectedDates[1]?.field.toString() || "",
      option3_field: selectedDates[2]?.field.toString() || "",
      option4_field: selectedDates[3]?.field.toString() || "",
      option5_field: selectedDates[4]?.field.toString() || "",
    };

    console.log(RRdata);
    await createRR(RRdata);
  };

  // const hasGameThisSlot = (event: any) => {
  //   const { field1, field2, field3 } = event.extendedProps;

  //   const checkTeams = (field: any) => {
  //     return (
  //       field?.home_id === rescheduleGame?.home_id ||
  //       field?.away === rescheduleGame?.home_id ||
  //       field?.home_id === rescheduleGame?.away_id ||
  //       field?.away_id === rescheduleGame?.away_id
  //     );
  //   };

  //   return checkTeams(field1) || checkTeams(field2) || checkTeams(field3);
  // };

  const hasGameThisSlot = (start: Date, end: Date, field: string): boolean => {
    // console.log("Checking for games in this slot...");
    // console.log("Game to reshedule:", events);
    if (!rescheduleGame || !events) return false;
  
    // Check if any event in the schedule overlaps with the given slot
    return events.some((event) => {
      // Skip spacer events
      if (event.spacer) {
        return false;
      }
  
      // Check if the event overlaps with the reschedule slot
      const involvesSameTeams =
        event.home_id === rescheduleGame.home_id ||
        event.away_id === rescheduleGame.home_id ||
        event.home_id === rescheduleGame.away_id ||
        event.away_id === rescheduleGame.away_id;
  
      const overlapsInTime =
        (start >= event.start && start < event.end) || // Reschedule slot starts within the event
        (end > event.start && end <= event.end) || // Reschedule slot ends within the event
        (start <= event.start && end >= event.end); // Reschedule slot fully contains the event
  
      return involvesSameTeams && overlapsInTime;
    });
  };

  const closePopup = () => {
    setPopupVisible(false);
    setRescheduleGame(undefined);
  };

  function deriveTimeslot(date: Date): string {
    if (date.getHours() === 17) {
      return "1";
    } else if (date.getHours() === 18) {
      return "2";
    } else if (date.getHours() === 20) {
      return "3";
    } else if (date.getHours() === 21) {
      return "4";
    }
    return "0";
  }

  // Existing loading check at the end of the component
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Spinner label="Loading Schedule..." size="lg" />
      </div>
    );
  }

  return (
    <div>
      {viewer ? (
        null
      ) : (
        <h1 className={title()}>Schedule</h1>
      )}
      {schedType === 3 ? (
        <p className="text-2xl text-center mt-2">
          <em>Click up to 5 free game slots to reschedule your team's game</em>
        </p>
      ) : (userRole === "team") && !viewer ? (
        <p className="text-2xl text-center mt-2">
          <em>
            Click on one of your team's games to reschedule the game or submit a
            score
          </em>
        </p>
      ) : (userRole === "commissioner") && !viewer ? (
        <p className="text-2xl text-center mt-2">
          <em>
            Click on a game to reschedule or submit a score
          </em>
        </p>
      ) : (
        <></>
      )}
      <div className="items-center p-6">
        <Card className="w-full max-w-9xl rounded-2xl shadow-lg p-6 bg-white dark:bg-gray-800">
          {schedType === 0 || schedType === 1 ? (
            <div className="legend flex justify-center items-center">
              <div className="legend-item">
                <div className="legend-color legend-game-played" />
                <span>Game Played</span>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-field1" />
                <span>Field 1</span>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-field2" />
                <span>Field 2</span>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-field3" />
                <span>Field 3</span>
              </div>
            </div>
          ) : schedType === 2 || schedType === 3 ? (
            <div className="legend flex justify-center items-center">
              <div className="legend-item">
                <div className="legend-color legend-game-played" />
                <span>Game Played</span>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-full-slot" />
                <span>Full Slot</span>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-free-slot" />
                <span>Free Slot</span>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-chosen-slot" />
                <span>Chosen Slot</span>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-rescheduled-teams" />
                <span>Game with Rescheduled Team</span>
              </div>
            </div>
          ) : null}
          <FullCalendar
            ref={calendarRef}
            allDaySlot={false}
            customButtons={{
              viewFullScheduleButton: {
                text: "View Full Schedule",
                click: () => {
                  setSchedType(0);
                  setLoading(true);
                  setView("timeGridWeek");
                  if (calendarRef.current) {
                    calendarRef.current.getApi().changeView("timeGridWeek"); // Force calendar to change view
                  }
                  (async () => {
                    let formattedEvents = await getSchedule(timeslots);
                    setEvents(formattedEvents);
                  })();
                  setLoading(false);
                },
              },
              viewTeamScheduleButton: {
                text: "View Team Schedule",
                click: () => {
                  setSchedType(1);
                  setLoading(true);
                  setView("dayGridMonth");
                  if (calendarRef.current) {
                    calendarRef.current.getApi().changeView("dayGridMonth"); // Force calendar to change view
                  }
                  (async () => {
                    let formattedEvents = await getTeamSchedule(teamId ? teamId : 0, timeslots);
                    setEvents(formattedEvents);
                  })();
                  setLoading(false);
                },
              },
              customToday: {
                text: "Today",
                click: () => {
                  if (calendarRef.current) {
                    calendarRef.current.getApi().today(); // Mimic the built-in today button behavior
                  }
                },
              },
            }}
            eventColor="transparent"
            eventContent={(eventInfo) => {
              const startTime = eventInfo.event.start
                ? new Date(eventInfo.event.start)
                    .toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    .slice(0, 5)
                : "";
              const endTime = eventInfo.event.end
                ? new Date(eventInfo.event.end)
                    .toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    .slice(0, 5)
                : "";

              const isPastEvent = () => {
                return eventInfo.event.extendedProps.played;
              };

              const containsRescheduleTeams = () => {
                return eventInfo.event.extendedProps.home_id === rescheduleGame?.home_id || eventInfo.event.extendedProps.away_id === rescheduleGame?.away_id
              };

              return schedType === 0 ? ( // Full Schedule
                eventInfo.event.extendedProps.home &&
                eventInfo.event.extendedProps.away ? (
                  <div
                    className={`event-content p-2 rounded-xl ${
                      isPastEvent()
                        ? "bg-gray-300 text-gray-600 border-2 border-gray-300"
                        : eventInfo.event.extendedProps.field === "1"
                        ? "bg-orange-100 text-orange-800 border-2 border-orange-100"
                        : eventInfo.event.extendedProps.field === "2"
                        ? "bg-cyan-100 text-blue-900 border-2 border-cyan-100"
                        : eventInfo.event.extendedProps.field === "3"
                        ? "bg-purple-100 text-purple-800 border-2 border-purple-100"
                        : "bg-orange-100 text-orange-80 border-2 border-orange-100"
                    } ${
                      isSelected(eventInfo.event.start, eventInfo.event.extendedProps.field)
                        ? "border-2 border-orange-500"
                        : ""
                    } ${
                      eventInfo.event.extendedProps.spacer ? "spacer-event" : ""
                    }`}
                    onClick={async (e) =>
                      handleTeamClick(
                        e,
                        eventInfo.event.start,
                        eventInfo.event.extendedProps.field,
                        eventInfo.event.extendedProps,
                      )
                    }
                  >
                    <div className="event-team font-semibold">
                      {eventInfo.event.extendedProps.home}
                    </div>
                    <div className="font-semibold">{"vs"}</div>
                    <div className="event-team font-semibold">
                      {eventInfo.event.extendedProps.away}
                    </div>
                    <div className="text-sm">{startTime}</div>
                    <div className="text-sm">{endTime}</div>
                    {!eventInfo.event.extendedProps.spacer && (
                      <div className="text-xs text-gray-600">{`Field ${eventInfo.event.extendedProps.field}`}</div>
                    )}
                  </div>
                ) : null
              ) : schedType === 1 ? ( // Team Schedule
                eventInfo.event.extendedProps.home &&
                eventInfo.event.extendedProps.away &&
                (teamId ===
                  eventInfo.event.extendedProps.home_id ||
                  teamId ===
                    eventInfo.event.extendedProps.away_id) ? (
                  <div
                    className={`event-content p-2 rounded-xl ${
                      isPastEvent()
                        ? "bg-gray-300 text-gray-600 border-2 border-gray-300"
                        : eventInfo.event.extendedProps.field === "1"
                        ? "bg-orange-100 text-orange-800 border-2 border-orange-100"
                        : eventInfo.event.extendedProps.field === "2"
                        ? "bg-cyan-100 text-blue-900 border-2 border-cyan-100"
                        : eventInfo.event.extendedProps.field === "3"
                        ? "bg-purple-100 text-purple-800 border-2 border-purple-100"
                        : "bg-orange-100 text-orange-80 border-2 border-orange-100"
                    } ${
                      isSelected(eventInfo.event.start, eventInfo.event.extendedProps.field)
                        ? "border-2 border-orange-500"
                        : ""
                    } ${
                      eventInfo.event.extendedProps.spacer ? "spacer-event" : ""
                    }`}
                      onClick={async (e) =>
                        handleTeamClick(
                          e,
                          eventInfo.event.start,
                          eventInfo.event.extendedProps.field,
                          eventInfo.event.extendedProps,
                        )
                      }
                  >
                    <div className="event-team font-semibold">
                      {eventInfo.event.extendedProps.home}
                    </div>
                    <div className="font-semibold">{"vs"}</div>
                    <div className="event-team font-semibold">
                      {eventInfo.event.extendedProps.away}
                    </div>
                    <div className="text-sm">
                      {startTime} - {endTime}
                    </div>
                    <div className="text-xs text-gray-600">{`Field ${eventInfo.event.extendedProps.field}`}</div>
                  </div>
                ) : null
              ) : schedType === 3 ? ( // Choose alternative game days
                eventInfo.event.extendedProps.home &&
                eventInfo.event.extendedProps.away && !eventInfo.event.extendedProps.spacer ? (
                  <div
                    className={`event-content p-2 rounded-xl ${containsRescheduleTeams() ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-100" : "bg-red-100 text-red-800 border-2 border-red-100"}`}
                  >
                    <div className="event-team font-semibold">
                      {eventInfo.event.extendedProps.home}
                    </div>
                    <div className="font-semibold">{"vs"}</div>
                    <div className="event-team font-semibold">
                      {eventInfo.event.extendedProps.away}
                    </div>
                    <div className="text-sm">{startTime}</div>
                    <div className="text-sm">{endTime}</div>
                    <div className="text-xs text-gray-600">{`Field ${eventInfo.event.extendedProps.field}`}</div>
                  </div>
                ) : eventInfo.event.extendedProps.spacer &&
                  eventInfo.event.extendedProps.home &&
                  eventInfo.event.start &&
                  eventInfo.event.end &&
                  eventInfo.event.start > currNextDate &&
                  !hasGameThisSlot(eventInfo.event.start, eventInfo.event.end, eventInfo.event.extendedProps.field) ? (
                  <div
                    className={`event-content click-to-select p-2 rounded-xl ${
                      isSelected(eventInfo.event.start, eventInfo.event.extendedProps.field)
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                    onClick={() =>
                      handleSelectClick(eventInfo.event.start, eventInfo.event.extendedProps.field)
                    }
                  >
                    <div className="font-semibold">{"Click to Select"}</div>
                    <div className="text-sm">
                      <br />
                      {startTime}
                      <br />
                      {endTime}
                    </div>
                    <div className="text-xs text-gray-600">{`Field ${eventInfo.event.extendedProps.field}`}</div>
                  </div>
                ) : null
              ) : null;
            }}
            eventOrder={"field"}
            slotEventOverlap={false}
            events={events}
            headerToolbar={{
              left:
                (userRole === "team" || userRole === "player") &&
                schedType === 1
                  ? "prev,next customToday viewFullScheduleButton"
                  : (userRole === "team" || userRole === "player") &&
                      schedType === 0
                    ? "prev,next customToday viewTeamScheduleButton"
                    : "prev,next customToday",
              right: "title",
            }}
            height="auto"
            initialDate={currDate}
            initialView={view}
            nowIndicator={true} // Shows the current time indicator
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              listPlugin,
              interactionPlugin,
            ]}
            slotDuration="00:30:00" // Duration of each slot (30 minutes)
            slotMaxTime="23:00:00" // End at 11 PM
            slotMinTime="17:00:00" // Start at 5 PM
            weekends={false}
          />
          {schedType === 3 &&
            (userRole != "commissioner" ? ( // Team Reschedule buttons
              <div className="mt-6 p-4 border-t border-gray-200 flex justify-between items-center">
                <div className="text-lg font-semibold">
                  Number of alternative dates selected: {selectedDates.length}/
                  {maxSelectedDates}
                </div>
                <div className="flex space-x-4">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={handleSendRequest}
                  >
                    Send Reschedule Request
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                    onClick={handleReturnClick} // Set schedType back to 0 to return to the full schedule view
                  >
                    Back to Schedule
                  </button>
                </div>
              </div>
            ) : (
              // Commissioner Reschedule buttons
              <div className="mt-6 p-4 border-t border-gray-200 flex justify-between items-center">
                <div className="text-lg font-semibold">
                  {selectedDates.length === 0
                    ? "No alternative date selected"
                    : "Alternative date selected"}
                </div>
                <div className="flex space-x-4">
                  <button
                    className={`px-4 py-2 rounded-lg ${selectedDates.length === 0 ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"}`}
                    disabled={selectedDates.length === 0}
                    onClick={handleCommissionerReschedule}
                  >
                    Submit Reschedule
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                    onClick={handleReturnClick} // Set schedType back to 0 to return to the full schedule view
                  >
                    Back to Schedule
                  </button>
                </div>
              </div>
            ))}
          {viewer && (
            <div className="flex justify-between items-center mt-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
                onClick={handleGenerateSchedule}
              >
                Generate Schedule
              </button>
              <div className="flex items-center">
                <span className="mr-4 text-lg">
                  {Object.keys(schedule).length === 0
                    ? "No new schedule to submit"
                    : `Current Schedule Score: ${schedScore}`}
                </span>
                <button
                  className={`px-4 py-2 rounded-lg ${Object.keys(schedule).length === 0 ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"}`}
                  disabled={Object.keys(schedule).length === 0}
                  onClick={handleSubmitSchedule}
                >
                  Submit Schedule
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
      {popupVisible && (
        <div
          ref={popupRef}
          className="popup-box p-4 bg-white border border-gray-300 rounded-lg shadow-lg"
          style={{
            position: "absolute",
            top: popupPosition.y,
            left: popupPosition.x,
            zIndex: 1000,
          }}
        >
          <div className="flex flex-col items-center">
            {userRole != "commissioner" ? (
              <button
                className={`w-full px-4 py-2 text-white rounded-lg mb-2 ${rescheduleGame && (userRole != "commissioner" && (rescheduleGame.date < currNextDate || gameScore?.played)) ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500"}`}
                disabled={rescheduleGame && (userRole != "commissioner" && (rescheduleGame.date < currNextDate || gameScore?.played))}
                onClick={handleRescheduleClick}
              >
                Reschedule
              </button>
            ) : (
              <button
                className={"w-full px-4 py-2 text-white rounded-lg mb-2 bg-blue-500"}
                onClick={handleRescheduleClick}
              >
                Reschedule
              </button>
            )}
            <button
              className={`w-full px-4 py-2 text-white rounded-lg mb-2 ${gameScore && (userRole != "commissioner" && (gameScore.date > currDate || gameScore.played)) ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500"}`}
              disabled={gameScore && (userRole != "commissioner" && (gameScore.date > currDate || gameScore.played))}
              onClick={handleSubmitScoreClick}
            >
              Submit Score
            </button>
            <button
              className="w-full px-4 py-2 bg-gray-400 text-white rounded-lg"
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {submitScoreVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 w-96">
            <h2 className="text-xl font-semibold mb-4">Submit Score</h2>

            {/* Home Team Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <label className="block">Home Team: {gameScore?.home_name}</label>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={homeTeamForfeit} 
                    disabled={awayTeamForfeit} // Disable if the away team has forfeited
                    onChange={() => { 
                      if (!homeTeamForfeit) {
                        setHomeTeamForfeit(true);
                        setAwayTeamForfeit(false);
                        setShowNoticeCheckbox(true);
                        setGameScore(prevScore => prevScore 
                          ? { ...prevScore, home_score: noticeChecked ? 1 : 0, away_score: 9 } 
                          : undefined
                        );
                      } else {
                        setHomeTeamForfeit(false);
                        setShowNoticeCheckbox(false);
                        setNoticeChecked(false);
                        setGameScore(prevScore => prevScore 
                          ? { ...prevScore, home_score: 0, away_score: 0 } 
                          : undefined
                        );
                      }
                    }} 
                  />
                  <span>Forfeit</span>
                </div>
              </div>
              <input 
                className="w-full px-4 py-2 border rounded-lg" 
                type="number" 
                min="0"
                disabled={homeTeamForfeit || awayTeamForfeit} // Disable when any team forfeits
                value={gameScore?.home_score !== null ? gameScore?.home_score : ""} 
                onChange={(e) => { 
                  if (gameScore) { 
                    setGameScore({ 
                      ...gameScore, 
                      home_score: Number(e.target.value) 
                    }); 
                  } 
                }} 
              />
            </div>

            {/* Away Team Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <label className="block">Away Team: {gameScore?.away_name}</label>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={awayTeamForfeit} 
                    disabled={homeTeamForfeit} // Disable if the home team has forfeited
                    onChange={() => { 
                      if (!awayTeamForfeit) {
                        setAwayTeamForfeit(true);
                        setHomeTeamForfeit(false);
                        setShowNoticeCheckbox(true);
                        setGameScore(prevScore => prevScore 
                          ? { ...prevScore, away_score: noticeChecked ? 1 : 0, home_score: 9 } 
                          : undefined
                        );
                      } else {
                        setAwayTeamForfeit(false);
                        setShowNoticeCheckbox(false);
                        setNoticeChecked(false);
                        setGameScore(prevScore => prevScore 
                          ? { ...prevScore, home_score: 0, away_score: 0 } 
                          : undefined
                        );
                      }
                    }} 
                  />
                  <span>Forfeit</span>
                </div>
              </div>
              <input 
                className="w-full px-4 py-2 border rounded-lg" 
                type="number" 
                min="0"
                disabled={homeTeamForfeit || awayTeamForfeit} // Disable when any team forfeits
                value={gameScore?.away_score !== null ? gameScore?.away_score : ""} 
                onChange={(e) => { 
                  if (gameScore) { 
                    setGameScore({ 
                      ...gameScore, 
                      away_score: Number(e.target.value) 
                    }); 
                  } 
                }} 
              />
            </div>

            {/* Notice Checkbox - Only Appears if Forfeit is Selected */}
            {showNoticeCheckbox && (
              <div className="mb-4 flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2" 
                  checked={noticeChecked} 
                  onChange={() => {
                    setNoticeChecked(!noticeChecked);
                    setGameScore(prevScore => {
                      if (!prevScore) return prevScore;
                      return homeTeamForfeit
                        ? { ...prevScore, home_score: noticeChecked ? 0 : 1, away_score: 9 }
                        : { ...prevScore, away_score: noticeChecked ? 0 : 1, home_score: 9 };
                    });
                  }} 
                />
                <span>Notice</span>
              </div>
            )}

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end space-x-4">
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg" 
                onClick={handleScoreSubmit}
              >
                Submit
              </button>
              <button 
                className="px-4 py-2 bg-gray-500 text-white rounded-lg" 
                onClick={handleScoreCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showScrollToTop && (
        <button
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-3 bg-blue-500 text-white rounded-full shadow-lg z-50"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      )}
    </div>
  );
}
