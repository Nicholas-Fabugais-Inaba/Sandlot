"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { title } from "@/components/primitives";
import { Card } from "@heroui/react";  // Import NextUI Card
import "./SchedulePage.css";  // Custom styles

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
      <div className="flex flex-col items-center p-6">
        <Card className="w-full max-w-4xl rounded-2xl shadow-lg p-6 bg-white">
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
            eventColor="transparent"
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
                <div className="event-content flex flex-col p-2 rounded-xl bg-blue-100 text-blue-800">
                  <div className="font-semibold">{eventInfo.event.title}</div>
                  <div className="text-sm">{startTime} - {endTime}</div>
                  <div className="text-xs text-gray-600">{eventInfo.event.extendedProps.field}</div>
                </div>
              );
            }}
          />
        </Card>
      </div>
    </div>
  );
}
