// app/schedule/page.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { getSession, signOut, signIn } from 'next-auth/react';
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { title } from "@/components/primitives";
import { Card, user } from "@heroui/react";  // Import NextUI Card
import "./SchedulePage.css";  // Custom styles
import getSchedule, { genSampleSchedule, getTeamSchedule, addEmptyEvents } from "../functions/getSchedule";
import { Event, GenSchedResponse } from "../types";
import createRR from "../functions/createRR";
import { Dictionary } from "@fullcalendar/core/internal";
import { useSchedule } from './ScheduleContext';
import saveSchedule from "../functions/saveSchedule";

const currDate = new Date("2025-06-20"); // Temporary current date, needs time in future
const currNextDate = new Date("2025-06-21");

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

interface SchedulePageProps {
  viewer?: boolean;
}

export default function SchedulePage({ viewer }: SchedulePageProps) {
  const context = useSchedule();
  const [events, setEvents] = context && context.events ? [context.events, context.setEvents] : useState<Event[]>();
  const [schedule, setSchedule] = context && context.schedule ? [context.schedule, context.setSchedule] : useState<Dictionary>({});
  const [schedScore, setSchedScore] = context && context.schedScore ? [context.schedScore, context.setSchedScore] : useState<number>(0);
  const [view, setView] = useState("timeGridWeek");
  const [selectedDates, setSelectedDates] = useState<SelectedDate[]>([]);
  const [rescheduleGame, setRescheduleGame] = useState<RescheduleGame>();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userTeamId, setUserTeamId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [schedType, setSchedType] = useState(0); // 0 = Full Schedule, 1 = Team Schedule, 2 = Choose game to reschedule, 3 = Choose alternative game days
  const [maxSelectedDates, setMaxSelectedDates] = useState(5); // Maximum number of dates that can be selected when rescheduling games

  // Fetch session data to get user role and team (if player or team account)
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        setUserRole(session.user?.role || null);
        setUserTeamId(session.user?.team_id || null);
        if (session.user?.role === "player" || session.user?.role === "team") {
          setSchedType(1);
          setView("dayGridMonth");
          if (calendarRef.current) {
            calendarRef.current.getApi().changeView("dayGridMonth"); // Force calendar to change view
          }
        }
        else if (session.user?.role === "commissioner" || session.user?.role === "role") {
          setSchedType(0);
          setMaxSelectedDates(1); // Set maxSelectedDates to 1 for commissioner
        }

        if (session.user?.role === "player" || session.user?.role === "team") {
          (async () => {
            let formattedEvents = await getTeamSchedule(session.user?.team_id);
            setEvents(formattedEvents)
          })();
        }
      }
      if (events === undefined) {
        (async () => {
          let formattedEvents = await getSchedule()
          setEvents(formattedEvents)
        })()
      }
    };
    setLoading(false); // Set loading to false after fetching session

    fetchSession();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        closePopup();
      }
    };

    if (popupVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popupVisible]);

  const handleSelectClick = (start: Date | null, field: number) => {
    if (start) {
      const isDuplicate = selectedDates.some(
        (selectedDate) => selectedDate.date.getTime() === start.getTime() && selectedDate.field === field
      );
      if (isDuplicate) {
        const newSelectedDates = selectedDates.filter(
          (selectedDate) => !(selectedDate.date.getTime() === start.getTime() && selectedDate.field === field)
        );
        setSelectedDates(newSelectedDates);
      } else {
        if (selectedDates.length >= maxSelectedDates) {
          return;
        }
        const newSelectedDates = [...selectedDates, { date: start, field }];
        setSelectedDates(newSelectedDates);
      }
    }
  };

  const handleTeamClick = (event: React.MouseEvent, start: Date | null, field: number, teams: any) => {
    // If the user is either a commissioner or the game selected is one the logged in team is playing in
    if (start && !viewer && (userRole === "commissioner" || userRole === "role" || (userRole === "team" && (teams.home_id === userTeamId || teams.away_id === userTeamId)))) {
      setPopupPosition({ x: event.pageX, y: event.pageY });
      setPopupVisible(true);
      setRescheduleGame({ game_id: teams.id, date: start, field: field, home_id: teams.home_id, away_id: teams.away_id });
    }
  };

  const handleRescheduleClick = () => {
    if (rescheduleGame && rescheduleGame?.date < currDate) {
      return;
    }
    setSchedType(3);
    setLoading(true);
    setView("timeGridWeek");
    (async () => {
      let formattedEvents = await getSchedule();
      formattedEvents = addEmptyEvents(formattedEvents);
      console.log("Here", formattedEvents);
      setEvents(formattedEvents)
    })();
    setPopupVisible(false);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView("timeGridWeek"); // Force calendar to change view
    }
    setLoading(false);
  };

  const handleReturnClick = () => {
    if (userRole === "player" || userRole === "team" || userRole === "role") {
      setSchedType(1);
      setLoading(true);
      (async () => {
        let formattedEvents = await getTeamSchedule(userTeamId? userTeamId : 0);
        setEvents(formattedEvents);
      })();
      setView("dayGridMonth");
      if (calendarRef.current) {
        calendarRef.current.getApi().changeView("dayGridMonth"); // Force calendar to change view
      }
      setLoading(false);
    }
    else {
      setSchedType(0);
    }
  };

  const handleGenerateSchedule = () => {
    // Implement the logic to generate the schedule
    console.log("Generate Schedule button clicked");

    // Set events to a schedule generated by the backend
    (async () => {
      let sampleSched = await genSampleSchedule(20);
      setEvents(sampleSched.events);
      setSchedule(sampleSched.schedule);
      setSchedScore(sampleSched.score);
    })();
  };

  const handleSubmitSchedule = () => {
    // Implement the logic to submit the schedule
    console.log("Submit Schedule button clicked");
    console.log(schedule);
    saveSchedule(schedule);
  };

  const handleCommissionerReschedule = () => {
    console.log("Commissioner submit reschedule: ", 
      selectedDates[0], " to reschedule game: ", rescheduleGame
    );
  }

  const isSelected = (start: Date | null, field: number) => {
    return start ? selectedDates.some((selectedDate) => selectedDate.date.getTime() === start.getTime() && selectedDate.field === field) : false;
  };

  const handleSendRequest = async () => {
    handleReturnClick();
    const RRdata = {
      requester_id: userTeamId,
      receiver_id: rescheduleGame?.home_id === userTeamId ? rescheduleGame?.away_id : rescheduleGame?.home_id,
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
    }
    console.log(RRdata);
    await createRR(RRdata)
  };

  const hasGameThisSlot = (event: any) => {
    const { field1, field2, field3 } = event.extendedProps;
  
    const checkTeams = (field: any) => {
      return field?.home_id === rescheduleGame?.home_id || field?.away === rescheduleGame?.home_id || field?.home_id === rescheduleGame?.away_id || field?.away_id === rescheduleGame?.away_id;
    };
  
    return checkTeams(field1) || checkTeams(field2) || checkTeams(field3);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setRescheduleGame(undefined);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching session
  }

  return (
    <div>
      {viewer ? (
        <h1 className={title()}>Schedule Generator</h1>
      ) : (
        <h1 className={title()}>Schedule</h1>
      )}
      {schedType === 3 ? (
        <p className="text-2xl font-semibold text-center mt-2">Choose alternate game slots</p>
      ) : (userRole === "team" || userRole === "commissioner") && !viewer ? (
        <p className="text-2xl font-semibold text-center mt-2">Click to reschedule a game</p>
      ) : (
        <></>
      )}
      <div className="items-center p-6">
        <Card className="w-full max-w-9xl rounded-2xl shadow-lg p-6 bg-white">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView={view}
            initialDate={currDate}
            events={events}
            allDaySlot={false}
            weekends={false}
            slotMinTime="16:00:00" // Start at 4 PM
            slotMaxTime="22:00:00" // End at 10 PM
            slotDuration="00:30:00" // Duration of each slot (30 minutes)
            headerToolbar={{
              left: (userRole === "team" || userRole === "player") && 
                schedType === 1 ? "prev,next customToday viewFullScheduleButton" : 
                (userRole === "team" || userRole === "player") && 
                schedType === 0 ? "prev,next customToday viewTeamScheduleButton" : 
                "prev,next customToday",
              right: "title"
            }}
            customButtons={{
              viewFullScheduleButton: {
                text: "View Full Schedule",
                click: () => {
                  setSchedType(0);
                  setView("timeGridWeek");
                  if (calendarRef.current) {
                    calendarRef.current.getApi().changeView("timeGridWeek"); // Force calendar to change view
                  }
                }
              },
              viewTeamScheduleButton: {
                text: "View Team Schedule",
                click: () => {
                  setSchedType(1);
                  setView("dayGridMonth");
                  if (calendarRef.current) {
                    calendarRef.current.getApi().changeView("dayGridMonth"); // Force calendar to change view
                  }
                }
              },
              customToday: {
                text: "Today",
                click: () => {
                  if (calendarRef.current) {
                    calendarRef.current.getApi().today(); // Mimic the built-in today button behavior
                  }
                }
              }
            }}
            eventColor="transparent"
            height="auto"
            nowIndicator={true} // Shows the current time indicator
            eventContent={(eventInfo) => {
              const startTime = eventInfo.event.start
                ? new Date(eventInfo.event.start)
                    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    .slice(0, 5)
                : "";
              const endTime = eventInfo.event.end
                ? new Date(eventInfo.event.end)
                    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    .slice(0, 5)
                : "";

              return schedType === 0 ? ( // Full Schedule
                <div className="event-content-grid" key={selectedDates.join(',')}>
                  {eventInfo.event.extendedProps.field1?.home && eventInfo.event.extendedProps.field1?.away ? (
                    <div
                      onClick={(e) => handleTeamClick(e, eventInfo.event.start, 1, eventInfo.event.extendedProps.field1)}
                      className={`event-content p-2 rounded-xl bg-orange-100 text-orange-800
                        ${isSelected(eventInfo.event.start, 1) ? "border-2 border-orange-500" : "border-2 border-orange-100"}`}
                    >
                      <div className="event-team font-semibold">{eventInfo.event.extendedProps.field1.home}</div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">{eventInfo.event.extendedProps.field1.away}</div>
                      <div className="text-sm">{startTime}</div>
                      <div className="text-sm">{endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 1"}</div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {eventInfo.event.extendedProps.field2?.home && eventInfo.event.extendedProps.field2?.away ? (
                    <div
                      onClick={(e) => handleTeamClick(e, eventInfo.event.start, 2, eventInfo.event.extendedProps.field2)}
                      className={`event-content p-2 rounded-xl bg-cyan-100 text-blue-800
                        ${isSelected(eventInfo.event.start, 2) ? "border-2 border-cyan-500" : "border-2 border-cyan-100"}`}
                    >
                      <div className="event-team font-semibold">{eventInfo.event.extendedProps.field2.home}</div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">{eventInfo.event.extendedProps.field2.away}</div>
                      <div className="text-sm">{startTime}</div>
                      <div className="text-sm">{endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 2"}</div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {eventInfo.event.extendedProps.field3?.home && eventInfo.event.extendedProps.field3?.away ? (
                    <div
                      onClick={(e) => handleTeamClick(e, eventInfo.event.start, 3, eventInfo.event.extendedProps.field3)}
                      className={`event-content p-2 rounded-xl bg-purple-100 text-purple-800
                        ${isSelected(eventInfo.event.start, 3) ? "border-2 border-purple-500" : "border-2 border-purple-100"}`}
                    >
                      <div className="event-team font-semibold">{eventInfo.event.extendedProps.field3.home}</div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">{eventInfo.event.extendedProps.field3.away}</div>
                      <div className="text-sm">{startTime}</div>
                      <div className="text-sm">{endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 3"}</div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              ) : schedType === 1 ? ( // Team Schedule
                <>
                  {eventInfo.event.extendedProps.field1?.home && eventInfo.event.extendedProps.field1?.away && 
                    (userTeamId === eventInfo.event.extendedProps.field1?.home_id || userTeamId === eventInfo.event.extendedProps.field1?.away_id) ? (
                      <div
                        onClick={(e) => handleTeamClick(e, eventInfo.event.start, 1, eventInfo.event.extendedProps.field1)}
                        className={`event-content p-2 rounded-xl bg-orange-100 text-orange-800
                          ${isSelected(eventInfo.event.start, 1) ? "border-2 border-orange-500" : "border-2 border-orange-100"}`}
                      >
                        <div className="event-team font-semibold">{eventInfo.event.extendedProps.field1.home}</div>
                        <div className="font-semibold">{"vs"}</div>
                        <div className="event-team font-semibold">{eventInfo.event.extendedProps.field1.away}</div>
                        <div className="text-sm">{startTime} - {endTime}</div>
                        <div className="text-xs text-gray-600">{"Field 1"}</div>
                      </div>
                    ) : null}
                  {eventInfo.event.extendedProps.field2?.home && eventInfo.event.extendedProps.field2?.away && 
                    (userTeamId === eventInfo.event.extendedProps.field2?.home_id || userTeamId === eventInfo.event.extendedProps.field2?.away_id) ? (
                      <div
                        onClick={(e) => handleTeamClick(e, eventInfo.event.start, 2, eventInfo.event.extendedProps.field2)}
                        className={`event-content p-2 rounded-xl bg-cyan-100 text-blue-800
                          ${isSelected(eventInfo.event.start, 2) ? "border-2 border-cyan-500" : "border-2 border-cyan-100"}`}
                      >
                        <div className="event-team font-semibold">{eventInfo.event.extendedProps.field2.home}</div>
                        <div className="font-semibold">{"vs"}</div>
                        <div className="event-team font-semibold">{eventInfo.event.extendedProps.field2.away}</div>
                        <div className="text-sm">{startTime} - {endTime}</div>
                        <div className="text-xs text-gray-600">{"Field 2"}</div>
                      </div>
                    ) : null}
                  {eventInfo.event.extendedProps.field3?.home && eventInfo.event.extendedProps.field3?.away &&
                    (userTeamId === eventInfo.event.extendedProps.field3?.home_id || userTeamId === eventInfo.event.extendedProps.field3?.away_id) ? (
                      <div
                        onClick={(e) => handleTeamClick(e, eventInfo.event.start, 3, eventInfo.event.extendedProps.field3)}
                        className={`event-content p-2 rounded-xl bg-purple-100 text-purple-800
                          ${isSelected(eventInfo.event.start, 3) ? "border-2 border-purple-500" : "border-2 border-purple-100"}`}
                      >
                        <div className="event-team font-semibold">{eventInfo.event.extendedProps.field3.home}</div>
                        <div className="font-semibold">{"vs"}</div>
                        <div className="event-team font-semibold">{eventInfo.event.extendedProps.field3.away}</div>
                        <div className="text-sm">{startTime} - {endTime}</div>
                        <div className="text-xs text-gray-600">{"Field 3"}</div>
                      </div>
                    ) : null}
                </>
              ) : schedType === 2 ? ( // Select game to reschedule
                <>
                  {eventInfo.event.extendedProps.field1?.home && eventInfo.event.extendedProps.field1?.away && 
                    (userTeamId === eventInfo.event.extendedProps.field1?.home_id || userTeamId === eventInfo.event.extendedProps.field1?.away_id) ? (
                      <div
                        onClick={(e) => handleTeamClick(e, eventInfo.event.start, 1, eventInfo.event.extendedProps.field1)}
                        className={`event-content p-2 rounded-xl bg-green-100 text-green-800
                          ${isSelected(eventInfo.event.start, 1) ? "border-2 border-green-500" : "border-2 border-green-100"}`}
                      >
                        <div className="event-team font-semibold">{eventInfo.event.extendedProps.field1.home}</div>
                        <div className="font-semibold">{"vs"}</div>
                        <div className="event-team font-semibold">{eventInfo.event.extendedProps.field1.away}</div>
                        <div className="text-sm">{startTime} - {endTime}</div>
                        <div className="text-xs text-gray-600">{"Field 1"}</div>
                      </div>
                    ) : null}
                  {eventInfo.event.extendedProps.field2?.home && eventInfo.event.extendedProps.field2?.away && 
                    (userTeamId === eventInfo.event.extendedProps.field2?.home_id || userTeamId === eventInfo.event.extendedProps.field2?.away_id) ? (
                      <div
                        onClick={(e) => handleTeamClick(e, eventInfo.event.start, 2, eventInfo.event.extendedProps.field2)}
                        className={`event-content p-2 rounded-xl bg-green-100 text-green-800
                          ${isSelected(eventInfo.event.start, 2) ? "border-2 border-green-500" : "border-2 border-green-100"}`}
                      >
                        <div className="event-team font-semibold">{eventInfo.event.extendedProps.field2.home}</div>
                        <div className="font-semibold">{"vs"}</div>
                        <div className="event-team font-semibold">{eventInfo.event.extendedProps.field2.away}</div>
                        <div className="text-sm">{startTime} - {endTime}</div>
                        <div className="text-xs text-gray-600">{"Field 2"}</div>
                      </div>
                    ) : null}
                  {eventInfo.event.extendedProps.field3?.home && eventInfo.event.extendedProps.field3?.away &&
                    (userTeamId === eventInfo.event.extendedProps.field3?.home_id || userTeamId === eventInfo.event.extendedProps.field3?.away_id) ? (
                      <div
                        onClick={(e) => handleTeamClick(e, eventInfo.event.start, 3, eventInfo.event.extendedProps.field3)}
                        className={`event-content p-2 rounded-xl bg-green-100 text-green-800
                          ${isSelected(eventInfo.event.start, 3) ? "border-2 border-green-500" : "border-2 border-green-100"}`}
                      >
                        <div className="event-team font-semibold">{eventInfo.event.extendedProps.field3.home}</div>
                        <div className="font-semibold">{"vs"}</div>
                        <div className="event-team font-semibold">{eventInfo.event.extendedProps.field3.away}</div>
                        <div className="text-sm">{startTime} - {endTime}</div>
                        <div className="text-xs text-gray-600">{"Field 3"}</div>
                      </div>
                    ) : null}
                </>
              ) : schedType === 3 ? ( // Choose alternative game days
                <div className="event-content-grid">
                  {eventInfo.event.extendedProps.field1?.home && eventInfo.event.extendedProps.field1?.away ? (
                    <div className="event-content p-2 rounded-xl bg-red-100 text-red-800">
                      <div className="event-team font-semibold">{eventInfo.event.extendedProps.field1.home}</div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">{eventInfo.event.extendedProps.field1.away}</div>
                      <div className="text-sm">{startTime}</div>
                      <div className="text-sm">{endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 1"}</div>
                    </div>
                  ) : !hasGameThisSlot(eventInfo.event) && eventInfo.event.start && eventInfo.event.start > currNextDate ? (
                    <div
                      onClick={() => handleSelectClick(eventInfo.event.start, 1)}
                      className={`event-content p-2 rounded-xl ${isSelected(eventInfo.event.start, 1) ? 
                        "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                    >
                      <div className="font-semibold">{"Click to Select"}</div>
                      <div className="text-sm"><br />{startTime}<br />{endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 1"}</div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {eventInfo.event.extendedProps.field2?.home && eventInfo.event.extendedProps.field2?.away ? (
                    <div className="event-content p-2 rounded-xl bg-red-100 text-red-800">
                      <div className="event-team font-semibold">{eventInfo.event.extendedProps.field2.home}</div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">{eventInfo.event.extendedProps.field2.away}</div>
                      <div className="text-sm">{startTime}</div>
                      <div className="text-sm">{endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 2"}</div>
                    </div>
                  ) : !hasGameThisSlot(eventInfo.event) && eventInfo.event.start && eventInfo.event.start > currNextDate ? (
                    <div
                      onClick={() => handleSelectClick(eventInfo.event.start, 2)}
                      className={`event-content p-2 rounded-xl ${isSelected(eventInfo.event.start, 2) ? 
                        "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                    >
                      <div className="font-semibold">{"Click to Select"}</div>
                      <div className="text-sm"><br />{startTime}<br />{endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 2"}</div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {eventInfo.event.extendedProps.field3?.home && eventInfo.event.extendedProps.field3?.away ? (
                    <div className="event-content p-2 rounded-xl bg-red-100 text-red-800">
                      <div className="event-team font-semibold">{eventInfo.event.extendedProps.field3.home}</div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">{eventInfo.event.extendedProps.field3.away}</div>
                      <div className="text-sm">{startTime}</div>
                      <div className="text-sm">{endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 3"}</div>
                    </div>
                  ) : !hasGameThisSlot(eventInfo.event) && eventInfo.event.start && eventInfo.event.start > currNextDate ? (
                    <div
                      onClick={() => handleSelectClick(eventInfo.event.start, 3)}
                      className={`event-content p-2 rounded-xl ${isSelected(eventInfo.event.start, 3) ? 
                        "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                    >
                      <div className="font-semibold">{"Click to Select"}</div>
                      <div className="text-sm"><br />{startTime}<br />{endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 3"}</div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              ) : null}
            }
          />
          {schedType === 3 && (
            userRole != "commissioner" ? ( // Team Reschedule buttons
              <div className="mt-6 p-4 border-t border-gray-200 flex justify-between items-center">
                <div className="text-lg font-semibold">
                  Number of alternative dates selected: {selectedDates.length}/{maxSelectedDates}
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleSendRequest}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Send Reschedule Request
                  </button>
                  <button
                    onClick={handleReturnClick} // Set schedType back to 0 to return to the full schedule view
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                  >
                    Back to Schedule
                  </button>
                </div>
              </div>
            ) : ( // Commissioner Reschedule buttons
              <div className="mt-6 p-4 border-t border-gray-200 flex justify-between items-center">
                <div className="text-lg font-semibold">
                  {selectedDates.length === 0 ? "No alternative date selected" : "Alternative date selected"}
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleCommissionerReschedule}
                    className={`px-4 py-2 rounded-lg ${selectedDates.length === 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                    disabled={selectedDates.length === 0}
                  >
                    Submit Reschedule
                  </button>
                  <button
                    onClick={handleReturnClick} // Set schedType back to 0 to return to the full schedule view
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                  >
                    Back to Schedule
                  </button>
                </div>
              </div>
            )
          )}
          {viewer && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleGenerateSchedule}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Generate Schedule
              </button>
              <div className="flex items-center">
                <span className="mr-4 text-lg">
                  {Object.keys(schedule).length === 0 ? "No new schedule to submit" : `Current Schedule Score: ${schedScore}`}
                </span>
                <button
                  onClick={handleSubmitSchedule}
                  className={`px-4 py-2 rounded-lg ${Object.keys(schedule).length === 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                  disabled={Object.keys(schedule).length === 0}
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
          style={{ position: 'absolute', top: popupPosition.y, left: popupPosition.x, zIndex: 1000 }}
          className="popup-box p-4 bg-white border border-gray-300 rounded-lg shadow-lg"
        >
          <div className="flex flex-col items-center">
            <button
              onClick={handleRescheduleClick}
              className={`w-full px-4 py-2 text-white rounded-lg mb-2 ${rescheduleGame && rescheduleGame.date < currDate ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500'}`}
              disabled={rescheduleGame && rescheduleGame.date < currNextDate}
            >
              Reschedule
            </button>
            <button
              onClick={() => {
                alert("Submit score");
              }}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg mb-2"
            >
              Submit Score
            </button>
            <button
              onClick={closePopup}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
