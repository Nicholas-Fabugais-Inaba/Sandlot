// need to get a beter understanding of client vs. system components
'use client'

import styles from './styles.module.css'
import Calendar from "@/components/calendar";
import getSchedule from '../functions/getSchedule'

import { useState } from 'react';

export default function Home() {
  const [games, setGames] = useState([]);
  console.log("games:");
  console.log(games)

  return (
    <div className={styles.container}>
      <div 
        className={styles.button} 
        onClick={async () => {setGames(await getSchedule())}}
      >
          Generate Schedule
      </div>
      <div className={styles.calendar}>
        <Calendar games={games}></Calendar>
      </div>
    </div>
  );
}