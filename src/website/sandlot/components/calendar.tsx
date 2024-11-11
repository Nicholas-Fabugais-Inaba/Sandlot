import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // might be unneccesary package, keeping it for now
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin
import styles from '../app/styles.module.css'; // Import the CSS module

export default function Calendar() {
  const games = [
    {
      title: 'Game: Tigers vs Dodgers',
      start: '2024-11-08T17:00:00',
      end: '2024-11-08T18:30:00',
    },
    {
      title: 'Game: Mets vs Yankees',
      start: '2024-11-08T17:00:00',
      end: '2024-11-08T18:30:00',
    },
    {
      title: 'Game: Cubs vs Red Sox',
      start: '2024-11-08T17:00:00',
      end: '2024-11-08T18:30:00',
    },
  ];

  return (
    <FullCalendar
        plugins={[ timeGridPlugin, dayGridPlugin ]}
        initialView="timeGridWeek"
        height={"100%"}
        allDaySlot={false}
        expandRows={true}
        weekends={false}
        slotMinTime="13:00:00" // Slot starts at 1 PM
        slotMaxTime="23:59:00" // Slot ends at 11 PM
        events={games}
        eventClassNames={[styles.games]} // Apply the CSS module class to events
    />
  )
}