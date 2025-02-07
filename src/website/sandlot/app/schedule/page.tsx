// app/schedule/page.tsx

"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { title } from "@/components/primitives";
import { Card } from "@heroui/react";  // Import NextUI Card
import "./SchedulePage.css";  // Custom styles
import getSchedule from "../functions/getSchedule";
import { Event } from "../types";

var events = [
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
      away: "Mets",
    },
    // field2: {
    //   home: "Jays",
    //   away: "White Sox",
    // },
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
      away: "Buccanneers Buccanneers",
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

var schedType = 3 // 0 = Full Schedule, 1 = Team Schedule, 2 = Choose game to reschedule, 3 = Choose alternative game days
var schedStart = new Date("2025-05-05T17:00:00"); // Season start and end dates
var schedEnd = new Date("2025-08-20T20:00:00");
var currTeam = "Yankees";

interface SelectedDate {
  date: Date;
  field: number;
}

export default function SchedulePage() {
  const initialView = schedType === 1 || schedType === 2 ? "dayGridMonth" : "timeGridWeek";
  const [view, setView] = useState(initialView);
  const [selectedDates, setSelectedDates] = useState<SelectedDate[]>([]);
  const [events, setEvents] = useState<Event[]>();
  
  // const [selectedDates, setSelectedDates] = useState<Date[]>(() => {
  //   // Retrieve saved dates from localStorage
  //   const savedDates = localStorage.getItem('selectedDates');
  //   return savedDates ? JSON.parse(savedDates) : [];
  // });

  // useEffect(() => {
  //   // Save selectedDates to localStorage whenever it changes
  //   localStorage.setItem('selectedDates', JSON.stringify(selectedDates));
  // }, [selectedDates]);
      
  // on page initialization pulls schedule data from backend server and updates events in calendar
  useEffect(() => {
    (async () => {
      let formattedEvents = await getSchedule()
      setEvents(formattedEvents)
    })();
  }, []);

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
        // alert(`Removed: ${start.toString()} (Field: ${field})`);
      } else {
        if (selectedDates.length >= maxSelectedDates) {
          // alert(`You can only select up to ${maxSelectedDates} dates.`);
          return;
        }
        const newSelectedDates = [...selectedDates, { date: start, field }];
        setSelectedDates(newSelectedDates);
        // alert(`Added: ${start.toString()} (Field: ${field})`);
      }
    }
  };

  const handleTeamClick = (start: Date | null, field: number, team: string) => {
  }

  const isSelected = (start: Date | null, field: number) => {
    return start ? selectedDates.some((selectedDate) => selectedDate.date.getTime() === start.getTime() && selectedDate.field === field) : false;
  };

  const handleSendRequest = () => {
    // Implement the logic to send reschedule requests
    alert('Reschedule request sent!');
  };

  return (
    <div>
      <h1 className={title()}>Schedule</h1>
      <div className="items-center p-6">
        <Card className="w-full max-w-9xl rounded-2xl shadow-lg p-6 bg-white">
          <FullCalendar
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
              right: "title",
            }}
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
                    <div className="event-content p-2 rounded-xl bg-orange-100 text-orange-800">
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
                    <div className="event-content p-2 rounded-xl bg-cyan-100 text-blue-800">
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
                    <div className="event-content p-2 rounded-xl bg-purple-100 text-purple-800">
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
                    <div className="event-content p-2 rounded-xl bg-orange-100 text-orange-800">
                      <div className="event-team font-semibold">{eventInfo.event.extendedProps.field1.home}</div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">{eventInfo.event.extendedProps.field1.away}</div>
                      <div className="text-sm">{startTime} - {endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 1"}</div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {eventInfo.event.extendedProps.field2?.home && eventInfo.event.extendedProps.field2?.away && 
                    (currTeam === eventInfo.event.extendedProps.field2?.home || currTeam === eventInfo.event.extendedProps.field2?.away) ? (
                    <div className="event-content p-2 rounded-xl bg-cyan-100 text-blue-800">
                      <div className="event-team font-semibold">{eventInfo.event.extendedProps.field2.home}</div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">{eventInfo.event.extendedProps.field2.away}</div>
                      <div className="text-sm">{startTime} - {endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 2"}</div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {eventInfo.event.extendedProps.field3?.home && eventInfo.event.extendedProps.field3?.away &&
                    (currTeam === eventInfo.event.extendedProps.field3?.home || currTeam === eventInfo.event.extendedProps.field3?.away) ? (
                    <div className="event-content p-2 rounded-xl bg-purple-100 text-purple-800">
                      <div className="event-team font-semibold">{eventInfo.event.extendedProps.field3.home}</div>
                      <div className="font-semibold">{"vs"}</div>
                      <div className="event-team font-semibold">{eventInfo.event.extendedProps.field3.away}</div>
                      <div className="text-sm">{startTime} - {endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 3"}</div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </>
              ) : schedType === 2 ? ( // Choose game to reschedule
                <div></div>
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
                  ) : (
                    <div
                      onClick={() => handleSelectClick(eventInfo.event.start, 1)}
                      className={`event-content p-2 rounded-xl ${isSelected(eventInfo.event.start, 1) ? 
                        "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                    >
                      <div className="font-semibold">{"Click to Select"}</div>
                      <div className="text-sm"><br />{startTime}<br />{endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 1"}</div>
                    </div>
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
                  ) : (
                    <div
                      onClick={() => handleSelectClick(eventInfo.event.start, 2)}
                      className={`event-content p-2 rounded-xl ${isSelected(eventInfo.event.start, 2) ? 
                        "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                    >
                      <div className="font-semibold">{"Click to Select"}</div>
                      <div className="text-sm"><br />{startTime}<br />{endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 2"}</div>
                    </div>
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
                  ) : (
                    <div
                      onClick={() => handleSelectClick(eventInfo.event.start, 3)}
                      className={`event-content p-2 rounded-xl ${isSelected(eventInfo.event.start, 3) ? 
                        "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                    >
                      <div className="font-semibold">{"Click to Select"}</div>
                      <div className="text-sm"><br />{startTime}<br />{endTime}</div>
                      <div className="text-xs text-gray-600">{"Field 3"}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div></div>
              );
            }}
          />
          {schedType === 3 && (
            <div className="mt-6 p-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-lg font-semibold">
                Number of alternative dates selected: {selectedDates.length}
              </div>
              <button
                onClick={handleSendRequest}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Send Reschedule Request
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
