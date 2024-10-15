// need to get a beter understanding of client vs. system components
'use client'

import styles from './styles.module.css'
import Calendar from "@/components/calendar";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.calendar}>
        <Calendar></Calendar>
      </div>
    </div>
  );
}