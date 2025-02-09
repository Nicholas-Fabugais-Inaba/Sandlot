// app/schedule/page.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { getSession, signOut, signIn } from 'next-auth/react';
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { title } from "@/components/primitives";
import { Card, user } from "@heroui/react";  // Import NextUI Card
import "./SchedulePage.css";  // Custom styles
import getSchedule from "../functions/getSchedule";
import { Event } from "../types";

var events = [ // If schedType is 3, need placeholders with nothing. If schedType is 1, only list games with currTeam.
  {
    start: "2025-01-27T17:00:00",
    end: "2025-01-27T18:30:00",
  },
  {
    start: "2025-01-27T18:30:00",
    end: "2025-01-27T20:00:00",
  },
  {
    start: "2025-01-27T20:00:00",
    end: "2025-01-27T21:30:00",
  },
  {
    start: "2025-01-28T17:00:00",
    end: "2025-01-28T18:30:00",
    field1: {
      home: "Yankees",
      away: "Mariners",
    },
  },
  {
    start: "2025-01-28T18:30:00",
    end: "2025-01-28T20:00:00",
  },
  {
    start: "2025-01-28T20:00:00",
    end: "2025-01-28T21:30:00",
  },
  {
    start: "2025-01-29T17:00:00",
    end: "2025-01-29T18:30:00",
    field1: {
      home: "Cubs",
      away: "Astros",
    },
    field2: {
      home: "Jays",
      away: "White Sox",
    },
    // field3: {
    //   home: "Mariners",
    //   away: "Reds",
    // }
  },
  {
    start: "2025-01-29T18:30:00",
    end: "2025-01-29T20:00:00",
    field2: {
      home: "Yankees",
      away: "Red Sox",
    },
  },
  {
    start: "2025-01-29T20:00:00",
    end: "2025-01-29T21:30:00",
  },
  {
    start: "2025-01-30T17:00:00",
    end: "2025-01-30T18:30:00",
  },
  {
    start: "2025-01-30T18:30:00",
    end: "2025-01-30T20:00:00",
  },
  {
    start: "2025-01-30T20:00:00",
    end: "2025-0130T21:30:00",
  },
  {
    start: "2025-01-31T17:00:00",
    end: "2025-01-31T18:30:00",
    field3: {
      home: "Yankees",
      away: "Mariners",
    },
  },
  {
    start: "2025-01-31T18:30:00",
    end: "2025-01-31T20:00:00",
  },
  {
    start: "2025-01-31T20:00:00",
    end: "2025-01-31T21:30:00",
  },
];

// Helper function to add placeholder events
const addPlaceholderEvents = (events: any[], schedType: number, schedStart: Date, schedEnd: Date) => {
  if (schedType === 3) {
    const currentDate = new Date(schedStart);

    while (currentDate <= schedEnd) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends (Sunday = 0, Saturday = 6)
        for(let i = 0; i < 3; i++) {
          const startDateTime = new Date(currentDate);
          if (i === 0) {
            startDateTime.setHours(17, 0, 0, 0); // Set time to 17:00:00
          } else if (i === 1) {
            startDateTime.setHours(18, 30, 0, 0); // Set time to 18:30:00
          } else {
            startDateTime.setHours(20, 0, 0, 0); // Set time to 20:00:00
          }
          const endDateTime = new Date(startDateTime.getTime() + 90 * 60 * 1000); // 90 minutes later
          const newEvent = {
            start: startDateTime.toISOString(),
            end: endDateTime.toISOString(),
          };
          events.push(newEvent);
        }
      }
    }
  } else {
    return events;
  }
};

const maxSelectedDates = 5; // Maximum number of dates that can be selected when rescheduling games

var schedStart = new Date("2025-05-05T17:00:00"); // Season start and end dates
var schedEnd = new Date("2025-08-20T20:00:00");
var currTeam = "Yankees";

interface SelectedDate {
  date: Date;
  field: number;
}

interface RescheduleGame {
  date: Date;
  field: number;
  home: string;
  away: string;
}

export default function SchedulePage() {
  const [view, setView] = useState("timeGridWeek");
  const [selectedDates, setSelectedDates] = useState<SelectedDate[]>([]);
  const [rescheduleGame, setRescheduleGame] = useState<RescheduleGame>();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [schedType, setSchedType] = useState(0); // 0 = Full Schedule, 1 = Team Schedule, 2 = Choose game to reschedule, 3 = Choose alternative game days
  // const [events, setEvents] = useState<Event[]>();
      
  // // on page initialization pulls schedule data from backend server and updates events in calendar
  // useEffect(() => {
  //   (async () => {
  //     let formattedEvents = await getSchedule()
  //     setEvents(formattedEvents)
  //   })();
  // }, []);

  // Fetch session data to get user role and team (if player or team account)
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        setUserRole(session.user?.role || null);
        if (session.user?.role === "player" || session.user?.role === "team") {
          setSchedType(1);
          setView("dayGridMonth");
        }
        else if (session.user?.role === "commissioner" || session.user?.role === "role") {
          setSchedType(0);
        }
      }
      setLoading(false); // Set loading to false after fetching session
    };

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
    if (start && (userRole === "commissioner" || userRole === "role" || (userRole === "team" && (teams.home === currTeam || teams.away === currTeam)))) {
      setPopupPosition({ x: event.pageX, y: event.pageY });
      setPopupVisible(true);
      setRescheduleGame({ date: start, field: field, home: teams.home, away: teams.away });
    }
  };

  const handleRescheduleClick = () => {
    setSchedType(3);
    setView("timeGridWeek");
    setPopupVisible(false);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView("timeGridWeek"); // Force calendar to change view
    }
  };

  const handleReturnClick = () => {
    if (userRole === "player" || userRole === "team" || userRole === "role") {
      setSchedType(1);
      setView("dayGridMonth");
      if (calendarRef.current) {
        calendarRef.current.getApi().changeView("dayGridMonth"); // Force calendar to change view
      }
    }
    else {
      setSchedType(0);
    }
  };

  const isSelected = (start: Date | null, field: number) => {
    return start ? selectedDates.some((selectedDate) => selectedDate.date.getTime() === start.getTime() && selectedDate.field === field) : false;
  };

  const handleSendRequest = () => {
    // Implement the logic to send reschedule requests
    alert('Reschedule request sent!');
  };

  const hasGameThisSlot = (event: any) => {
    const { field1, field2, field3 } = event.extendedProps;
  
    const checkTeams = (field: any) => {
      return field?.home === rescheduleGame?.home || field?.away === rescheduleGame?.home || field?.home === rescheduleGame?.away || field?.away === rescheduleGame?.away;
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
      <h1 className={title()}>Schedule</h1>
      {schedType === 3 ? (
        <p className="text-2xl font-semibold text-center mt-2">Choose alternate game slots</p>
      ) : userRole === "team" || userRole === "commissioner" ? (
        <p className="text-2xl font-semibold text-center mt-2">Click to reschedule a game</p>
      ) : (
        <></>
      )}
      <div className="items-center p-6">
        <Card className="w-full max-w-9xl rounded-2xl shadow-lg p-6 bg-white">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={view}
            events={events}
            allDaySlot={false}
            weekends={false}
            slotMinTime="16:00:00" // Start at 4 PM
            slotMaxTime="22:00:00" // End at 10 PM
            slotDuration="00:30:00" // Duration of each slot (30 minutes)
            headerToolbar={{
              left: "prev,next today",
              right: "title"
              // center: "title",
              // right: "customButton"
            }}
            // customButtons={{
            //   customButton: {
            //     text: 'Reschedule Selected',
            //     click: () => {
            //       alert('Custom button clicked!');
            //     }
            //   }
            // }}
            eventColor="transparent"
            height="auto"
            nowIndicator={true} // Shows the current time indicator
            // eventClick={(info) => alert(`Event: ${info.event.title}`)}
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
                    (currTeam === eventInfo.event.extendedProps.field1?.home || currTeam === eventInfo.event.extendedProps.field1?.away) ? (
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
                    (currTeam === eventInfo.event.extendedProps.field2?.home || currTeam === eventInfo.event.extendedProps.field2?.away) ? (
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
                    (currTeam === eventInfo.event.extendedProps.field3?.home || currTeam === eventInfo.event.extendedProps.field3?.away) ? (
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
                    (currTeam === eventInfo.event.extendedProps.field1?.home || currTeam === eventInfo.event.extendedProps.field1?.away) ? (
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
                    (currTeam === eventInfo.event.extendedProps.field2?.home || currTeam === eventInfo.event.extendedProps.field2?.away) ? (
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
                    (currTeam === eventInfo.event.extendedProps.field3?.home || currTeam === eventInfo.event.extendedProps.field3?.away) ? (
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
                  ) : !hasGameThisSlot(eventInfo.event) ? (
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
                  ) : !hasGameThisSlot(eventInfo.event) ? (
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
                  ) : !hasGameThisSlot(eventInfo.event) ? (
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
          {/* {schedType === 2 && (
            <div className="mt-6 p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleSendRequest}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Reschedule Selected
              </button>
            </div>
          )} */}
          {schedType === 3 && (
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
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg mb-2"
            >
              Reschedule
            </button>
            {/* <button
              onClick={() => {
                alert("Submit score");
              }}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg mb-2"
            >
              Submit Score
            </button> */}
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
