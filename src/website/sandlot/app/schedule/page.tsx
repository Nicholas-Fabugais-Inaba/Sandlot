"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { title } from "@/components/primitives";
import "./SchedulePage.css";  // Import your CSS file

const events = [
  {
    title: "Jays vs Mets",
    start: "2025-01-29T17:00:00",
    end: "2025-01-29T18:30:00",
    field: "Field 1",
  },
  {
    title: "Yankees vs Red Sox",
    start: "2025-01-29T18:30:00",
    end: "2025-01-29T20:00:00",
    field: "Field 2",
  },
];

export default function SchedulePage() {
  const [view, setView] = useState("timeGridWeek");

  return (
    <div>
      <h1 className={title()}>Schedule</h1>
      <div>
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
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
          eventColor="#007bff"
          height="auto"
          nowIndicator={true} // Shows the current time indicator
          eventClick={(info) => alert(`Event: ${info.event.title}`)}
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

            return (
              <div className="event-content">
                <div className="event-time">{startTime} - {endTime}</div>
                <div className="event-title">{eventInfo.event.title}</div>
                <div className="event-field">{eventInfo.event.extendedProps.field}</div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
