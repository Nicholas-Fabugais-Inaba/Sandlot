import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // might be unneccesary package, keeping it for now
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin
import styles from '../app/styles.module.css'; // Import the CSS module

import { useState, useEffect } from 'react';

export default function Calendar({ games }: any) {
  const [events, setEvents] = useState(games);

  useEffect(() => {
    setEvents(games)
  }, [games]);

  return (
    <FullCalendar
        plugins={[ timeGridPlugin, dayGridPlugin ]}
        initialView="timeGridWeek"
        height={"100%"}
        allDaySlot={false}
        expandRows={true}
        weekends={false}
        slotMinTime="16:00:00" // Slot starts at 4 PM
        slotMaxTime="22:00:00" // Slot ends at 10 PM
        events={events}
        eventClassNames={[styles.games]} // Apply the CSS module class to events
    />
  )
}