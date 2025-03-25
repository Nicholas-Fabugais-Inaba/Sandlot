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
  addEmptyEvents,
} from "../functions/getSchedule";
import { Event, GenSchedResponse } from "../types";
import createRR from "../functions/createRR";
import saveSchedule from "../functions/saveSchedule";
import getScore from "../functions/getScore";
import submitScore from "../functions/submitScore";
import commissionerReschedule from "../functions/commissionerReschedule";

import { useSchedule } from "./ScheduleContext";

import { title } from "@/components/primitives";

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
  const [submitScoreVisible, setSubmitScoreVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userTeamId, setUserTeamId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [schedType, setSchedType] = useState(0); // 0 = Full Schedule, 1 = Team Schedule, 2 = Choose game to reschedule, 3 = Choose alternative game days
  const [maxSelectedDates, setMaxSelectedDates] = useState(5); // Maximum number of dates that can be selected when rescheduling games

  // Fetch session data to get user role and team (if player or team account)
  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true); // Set loading to true at the start of fetching
      try {
        const session = await getSession();
  
        if (session) {
          setUserRole(session.user?.role || null);
          setUserTeamId(session.user?.team_id || null);
          
          // Adjust schedule type based on user role
          if (session.user?.role === "player" || session.user?.role === "team") {
            setSchedType(1);
            setView("dayGridMonth");
            if (calendarRef.current) {
              calendarRef.current.getApi().changeView("dayGridMonth");
            }
  
            // Fetch team schedule
            const formattedEvents = await getTeamSchedule(session.user?.team_id);
            setEvents(formattedEvents);
          } else if (
            session.user?.role === "commissioner" ||
            session.user?.role === "role"
          ) {
            setSchedType(0);
            setMaxSelectedDates(1);
  
            // Fetch full schedule
            const formattedEvents = await getSchedule();
            setEvents(formattedEvents);
          }
        } else {
          // Fetch default schedule if no session
          const formattedEvents = await getSchedule();
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
          (game.home_id === userTeamId || game.away_id === userTeamId)))
    ) {
      setPopupPosition({ x: event.pageX, y: event.pageY });
      setPopupVisible(true);
      setRescheduleGame({
        game_id: game.id,
        date: date,
        field: field,
        home_id: game.home_id,
        away_id: game.away_id,
      });

      // Set inital attributes while getScore is loading.
      setGameScore({
        game_id: game.id,
        played: true,
        date: new Date,
        home_score: 0,
        home_name: "",
        away_score: 0,
        away_name: "",
        forfeit: 0,
      });

      await getScore(game.id).then(
        (res) => {
          setGameScore({
            game_id: game.id,
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
  };

  const handleScoreSubmit = async () => {
    if (gameScore) {
      submitScore({
        game_id: gameScore.game_id,
        home_score: gameScore.home_score,
        away_score: gameScore.away_score,
        forfeit: gameScore.forfeit,
      });

      // Fetch event data to reflect the changes
      if (userRole === "team") {
        if (userTeamId && view === "dayGridMonth") {
          const updatedEvents = await getTeamSchedule(userTeamId);
          setEvents(updatedEvents);
        } else {
          const updatedEvents = await getSchedule();
          setEvents(updatedEvents);
        }
      } else {
        const updatedEvents = await getSchedule();
        setEvents(updatedEvents);
      }
    }
    setSubmitScoreVisible(false);
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
      let formattedEvents = await getSchedule();

      formattedEvents = addEmptyEvents(formattedEvents, currDate);
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
        let formattedEvents = await getTeamSchedule(userTeamId ? userTeamId : 0);
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
        let formattedEvents = await getSchedule();
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
      let sampleSched = await genSampleSchedule(20);

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
    handleReturnClick()
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
      requester_id: userTeamId,
      receiver_id:
        rescheduleGame?.home_id === userTeamId
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

  const hasGameThisSlot = (event: any) => {
    const { field1, field2, field3 } = event.extendedProps;

    const checkTeams = (field: any) => {
      return (
        field?.home_id === rescheduleGame?.home_id ||
        field?.away === rescheduleGame?.home_id ||
        field?.home_id === rescheduleGame?.away_id ||
        field?.away_id === rescheduleGame?.away_id
      );
    };

    return checkTeams(field1) || checkTeams(field2) || checkTeams(field3);
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
                    let formattedEvents = await getSchedule();
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
                    let formattedEvents = await getTeamSchedule(userTeamId ? userTeamId : 0);
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

              const isPastEvent = (field: number) => {
                if (field === 1) {
                  return eventInfo.event.extendedProps.field1?.played;
                } else if (field === 2) {
                  return eventInfo.event.extendedProps.field2?.played;
                } else if (field === 3) {
                  return eventInfo.event.extendedProps.field3?.played;
                }
              };

              const containsRescheduleTeams = (field: number) => {
                if (field === 1) {
                  return eventInfo.event.extendedProps.field1?.home_id === rescheduleGame?.home_id || eventInfo.event.extendedProps.field1?.away_id === rescheduleGame?.away_id
                } else if (field === 2) {
                  return eventInfo.event.extendedProps.field2?.home_id === rescheduleGame?.home_id || eventInfo.event.extendedProps.field2?.away_id === rescheduleGame?.away_id
                } else if (field === 3) {
                  return eventInfo.event.extendedProps.field3?.home_id === rescheduleGame?.home_id || eventInfo.event.extendedProps.field3?.away_id === rescheduleGame?.away_id
                }
              };

              return schedType === 0 ? ( // Full Schedule
                <div
                  key={selectedDates.join(",")}
                  className="event-content-grid"
                >
                  {eventInfo.event.extendedProps.field1?.home &&
                  eventInfo.event.extendedProps.field1?.away ? (
                    <div
                      className={`event-content p-2 rounded-xl ${isPastEvent(1) ? "bg-gray-300 text-gray-600 border-2 border-gray-300" : "bg-orange-100 text-orange-800"}
                        ${isSelected(eventInfo.event.start, 1) ? "border-2 border-orange-500" : ""}`}
                      onClick={async (e) =>
                        handleTeamClick(
                          e,
                          eventInfo.event.start,
                          1,
                          eventInfo.event.extendedProps.field1,
                        )
                      }
                    >
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field1.home}
                      </div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field1.away}
                      </div>
                      <div className="text-sm">{startTime}</div>
                      <div className="text-sm">{endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 1"}</div>
                    </div>
                  ) : (
                    <div />
                  )}
                  {eventInfo.event.extendedProps.field2?.home &&
                  eventInfo.event.extendedProps.field2?.away ? (
                    <div
                      className={`event-content p-2 rounded-xl ${isPastEvent(2) ? "bg-gray-300 text-gray-600 border-2 border-gray-300" : "bg-cyan-100 text-blue-800"}
                        ${isSelected(eventInfo.event.start, 2) ? "border-2 border-cyan-500" : ""}`}
                      onClick={async (e) =>
                        handleTeamClick(
                          e,
                          eventInfo.event.start,
                          2,
                          eventInfo.event.extendedProps.field2,
                        )
                      }
                    >
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field2.home}
                      </div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field2.away}
                      </div>
                      <div className="text-sm">{startTime}</div>
                      <div className="text-sm">{endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 2"}</div>
                    </div>
                  ) : (
                    <div />
                  )}
                  {eventInfo.event.extendedProps.field3?.home &&
                  eventInfo.event.extendedProps.field3?.away ? (
                    <div
                      className={`event-content p-2 rounded-xl ${isPastEvent(3) ? "bg-gray-300 text-gray-600 border-2 border-gray-300" : "bg-purple-100 text-purple-800"}
                        ${isSelected(eventInfo.event.start, 3) ? "border-2 border-purple-500" : ""}`}
                      onClick={async (e) =>
                        handleTeamClick(
                          e,
                          eventInfo.event.start,
                          3,
                          eventInfo.event.extendedProps.field3,
                        )
                      }
                    >
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field3.home}
                      </div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field3.away}
                      </div>
                      <div className="text-sm">{startTime}</div>
                      <div className="text-sm">{endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 3"}</div>
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              ) : schedType === 1 ? ( // Team Schedule
                <>
                  {eventInfo.event.extendedProps.field1?.home &&
                  eventInfo.event.extendedProps.field1?.away &&
                  (userTeamId ===
                    eventInfo.event.extendedProps.field1?.home_id ||
                    userTeamId ===
                      eventInfo.event.extendedProps.field1?.away_id) ? (
                    <div
                      className={`event-content p-2 rounded-xl ${isPastEvent(1) ? "bg-gray-300 text-gray-600 border-2 border-gray-300" : "bg-orange-100 text-orange-800"}
                          ${isSelected(eventInfo.event.start, 1) ? "border-2 border-orange-500" : ""}`}
                      onClick={async (e) =>
                        handleTeamClick(
                          e,
                          eventInfo.event.start,
                          1,
                          eventInfo.event.extendedProps.field1,
                        )
                      }
                    >
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field1.home}
                      </div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field1.away}
                      </div>
                      <div className="text-sm">
                        {startTime} - {endTime}
                      </div>
                      <div className="text-xs text-gray-600">{"Field 1"}</div>
                    </div>
                  ) : null}
                  {eventInfo.event.extendedProps.field2?.home &&
                  eventInfo.event.extendedProps.field2?.away &&
                  (userTeamId ===
                    eventInfo.event.extendedProps.field2?.home_id ||
                    userTeamId ===
                      eventInfo.event.extendedProps.field2?.away_id) ? (
                    <div
                      className={`event-content p-2 rounded-xl ${isPastEvent(2) ? "bg-gray-300 text-gray-600 border-2 border-gray-300" : "bg-cyan-100 text-blue-800"}
                          ${isSelected(eventInfo.event.start, 2) ? "border-2 border-cyan-500" : ""}`}
                      onClick={async (e) =>
                        handleTeamClick(
                          e,
                          eventInfo.event.start,
                          2,
                          eventInfo.event.extendedProps.field2,
                        )
                      }
                    >
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field2.home}
                      </div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field2.away}
                      </div>
                      <div className="text-sm">
                        {startTime} - {endTime}
                      </div>
                      <div className="text-xs text-gray-600">{"Field 2"}</div>
                    </div>
                  ) : null}
                  {eventInfo.event.extendedProps.field3?.home &&
                  eventInfo.event.extendedProps.field3?.away &&
                  (userTeamId ===
                    eventInfo.event.extendedProps.field3?.home_id ||
                    userTeamId ===
                      eventInfo.event.extendedProps.field3?.away_id) ? (
                    <div
                      className={`event-content p-2 rounded-xl ${isPastEvent(3) ? "bg-gray-300 text-gray-600 border-2 border-gray-300" : "bg-purple-100 text-purple-800"}
                          ${isSelected(eventInfo.event.start, 3) ? "border-2 border-purple-500" : ""}`}
                      onClick={async (e) =>
                        handleTeamClick(
                          e,
                          eventInfo.event.start,
                          3,
                          eventInfo.event.extendedProps.field3,
                        )
                      }
                    >
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field3.home}
                      </div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field3.away}
                      </div>
                      <div className="text-sm">
                        {startTime} - {endTime}
                      </div>
                      <div className="text-xs text-gray-600">{"Field 3"}</div>
                    </div>
                  ) : null}
                </>
              ) : schedType === 2 ? ( // Select game to reschedule
                <>
                  {eventInfo.event.extendedProps.field1?.home &&
                  eventInfo.event.extendedProps.field1?.away &&
                  (userTeamId ===
                    eventInfo.event.extendedProps.field1?.home_id ||
                    userTeamId ===
                      eventInfo.event.extendedProps.field1?.away_id) ? (
                    <div
                      className={`event-content p-2 rounded-xl bg-green-100 text-green-800
                          ${isSelected(eventInfo.event.start, 1) ? "border-2 border-green-500" : "border-2 border-green-100"}`}
                      onClick={async (e) =>
                        handleTeamClick(
                          e,
                          eventInfo.event.start,
                          1,
                          eventInfo.event.extendedProps.field1,
                        )
                      }
                    >
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field1.home}
                      </div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field1.away}
                      </div>
                      <div className="text-sm">
                        {startTime} - {endTime}
                      </div>
                      <div className="text-xs text-gray-600">{"Field 1"}</div>
                    </div>
                  ) : null}
                  {eventInfo.event.extendedProps.field2?.home &&
                  eventInfo.event.extendedProps.field2?.away &&
                  (userTeamId ===
                    eventInfo.event.extendedProps.field2?.home_id ||
                    userTeamId ===
                      eventInfo.event.extendedProps.field2?.away_id) ? (
                    <div
                      className={`event-content p-2 rounded-xl bg-green-100 text-green-800
                          ${isSelected(eventInfo.event.start, 2) ? "border-2 border-green-500" : "border-2 border-green-100"}`}
                      onClick={async (e) =>
                        handleTeamClick(
                          e,
                          eventInfo.event.start,
                          2,
                          eventInfo.event.extendedProps.field2,
                        )
                      }
                    >
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field2.home}
                      </div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field2.away}
                      </div>
                      <div className="text-sm">
                        {startTime} - {endTime}
                      </div>
                      <div className="text-xs text-gray-600">{"Field 2"}</div>
                    </div>
                  ) : null}
                  {eventInfo.event.extendedProps.field3?.home &&
                  eventInfo.event.extendedProps.field3?.away &&
                  (userTeamId ===
                    eventInfo.event.extendedProps.field3?.home_id ||
                    userTeamId ===
                      eventInfo.event.extendedProps.field3?.away_id) ? (
                    <div
                      className={`event-content p-2 rounded-xl bg-green-100 text-green-800
                          ${isSelected(eventInfo.event.start, 3) ? "border-2 border-green-500" : "border-2 border-green-100"}`}
                      onClick={async (e) =>
                        handleTeamClick(
                          e,
                          eventInfo.event.start,
                          3,
                          eventInfo.event.extendedProps.field3,
                        )
                      }
                    >
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field3.home}
                      </div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field3.away}
                      </div>
                      <div className="text-sm">
                        {startTime} - {endTime}
                      </div>
                      <div className="text-xs text-gray-600">{"Field 3"}</div>
                    </div>
                  ) : null}
                </>
              ) : schedType === 3 ? ( // Choose alternative game days
                <div className="event-content-grid">
                  {eventInfo.event.extendedProps.field1?.home &&
                  eventInfo.event.extendedProps.field1?.away ? (
                    <div
                      className={`event-content p-2 rounded-xl ${containsRescheduleTeams(1) ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-100" : "bg-red-100 text-red-800"}`}
                    >
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field1.home}
                      </div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field1.away}
                      </div>
                      <div className="text-sm">{startTime}</div>
                      <div className="text-sm">{endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 1"}</div>
                    </div>
                  ) : !hasGameThisSlot(eventInfo.event) && eventInfo.event.start?.getUTCHours() && (eventInfo.event.start.getUTCHours() === 21 || eventInfo.event.start.getUTCHours() === 22) &&
                    eventInfo.event.start &&
                    eventInfo.event.start > currNextDate ? (
                    <div
                      className={`event-content p-2 rounded-xl ${
                        isSelected(eventInfo.event.start, 1)
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                      onClick={() =>
                        handleSelectClick(eventInfo.event.start, 1)
                      }
                    >
                      <div className="font-semibold">{"Click to Select"}</div>
                      <div className="text-sm">
                        <br />
                        {startTime}
                        <br />
                        {endTime}
                      </div>
                      <div className="text-xs text-gray-600">{"Field 1"}</div>
                    </div>
                  ) : (
                    <div />
                  )}
                  {eventInfo.event.extendedProps.field2?.home &&
                  eventInfo.event.extendedProps.field2?.away ? (
                    <div
                      className={`event-content p-2 rounded-xl ${containsRescheduleTeams(2) ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-100" : "bg-red-100 text-red-800"}`}
                    >
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field2.home}
                      </div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field2.away}
                      </div>
                      <div className="text-sm">{startTime}</div>
                      <div className="text-sm">{endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 2"}</div>
                    </div>
                  ) : !hasGameThisSlot(eventInfo.event) && eventInfo.event.start?.getUTCHours() && (eventInfo.event.start.getUTCHours() === 21 || eventInfo.event.start.getUTCHours() === 22) &&
                    eventInfo.event.start &&
                    eventInfo.event.start > currNextDate ? (
                    <div
                      className={`event-content p-2 rounded-xl ${
                        isSelected(eventInfo.event.start, 2)
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                      onClick={() =>
                        handleSelectClick(eventInfo.event.start, 2)
                      }
                    >
                      <div className="font-semibold">{"Click to Select"}</div>
                      <div className="text-sm">
                        <br />
                        {startTime}
                        <br />
                        {endTime}
                      </div>
                      <div className="text-xs text-gray-600">{"Field 2"}</div>
                    </div>
                  ) : (
                    <div />
                  )}
                  {eventInfo.event.extendedProps.field3?.home &&
                  eventInfo.event.extendedProps.field3?.away ? (
                    <div
                      className={`event-content p-2 rounded-xl ${containsRescheduleTeams(3) ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-100" : "bg-red-100 text-red-800"}`}
                    >
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field3.home}
                      </div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">
                        {eventInfo.event.extendedProps.field3.away}
                      </div>
                      <div className="text-sm">{startTime}</div>
                      <div className="text-sm">{endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 3"}</div>
                    </div>
                  ) : !hasGameThisSlot(eventInfo.event) &&
                    eventInfo.event.start &&
                    eventInfo.event.start > currNextDate ? (
                    <div
                      className={`event-content p-2 rounded-xl ${
                        isSelected(eventInfo.event.start, 3)
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                      onClick={() =>
                        handleSelectClick(eventInfo.event.start, 3)
                      }
                    >
                      <div className="font-semibold">{"Click to Select"}</div>
                      <div className="text-sm">
                        <br />
                        {startTime}
                        <br />
                        {endTime}
                      </div>
                      <div className="text-xs text-gray-600">{"Field 3"}</div>
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              ) : null;
            }}
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
          <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4">Submit Score</h2>
            <div className="mb-4">
              <label className="block">
                Home Team: {gameScore?.home_name}
              </label>
              <input
                className="w-full px-4 py-2 border rounded-lg"
                type="number"
                value={
                  gameScore?.home_score !== null ? gameScore?.home_score : ""
                }
                onChange={(e) => {
                  if (gameScore) {
                    setGameScore({
                      ...gameScore,
                      home_score: Number(e.target.value),
                    });
                  }
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block">
                Away Team: {gameScore?.away_name}
              </label>
              <input
                className="w-full px-4 py-2 border rounded-lg"
                type="number"
                value={
                  gameScore?.away_score !== null ? gameScore?.away_score : ""
                }
                onChange={(e) => {
                  if (gameScore) {
                    setGameScore({
                      ...gameScore,
                      away_score: Number(e.target.value),
                    });
                  }
                }}
              />
            </div>
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
