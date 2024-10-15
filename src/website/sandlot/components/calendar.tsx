import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // might be unneccesary package, keeping it for now
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin

export default function Calendar() {
  return (
    <FullCalendar
        plugins={[ timeGridPlugin ]}
        initialView="timeGridWeek"
        height={"100%"}
        allDaySlot={false}
        expandRows={true}
    />
  )
}