// need to get a beter understanding of client vs. system components
'use client'

import styles from './styles.module.css'
import Calendar from "@/components/calendar";
import getSchedule from '../functions/getSchedule'

import { useState } from 'react';

export default function Home() {
  const [games, setGames] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false); // Loading state

  const handleGenerateSchedule = async () => {
    setLoading(true); // Set loading to true when fetching starts
    const fetchedGames = await getSchedule();
    setGames(fetchedGames);
    setLoading(false); // Set loading to false when fetching is done
  };

  return (
    <div className={styles.container}>
        <div 
          className={styles.button} 
          onClick={handleGenerateSchedule}
        >
          Generate Schedule
        </div>
        
        {/* Show the loading spinner when loading */}
        {loading && <div className={styles['loading-spinner']}></div>}  

        <div className={styles.calendar}>
          <Calendar games={games}></Calendar>
        </div>
    </div>
  );
}