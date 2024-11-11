// need to get a beter understanding of client vs. system components
'use client'

import styles from './styles.module.css'
import Calendar from "@/components/calendar";
import getSchedule from '../functions/getSchedule'

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.button} onClick={getSchedule}>Generate Schedule</div>
      <div className={styles.calendar}>
        <Calendar></Calendar>
      </div>
    </div>
  );
}