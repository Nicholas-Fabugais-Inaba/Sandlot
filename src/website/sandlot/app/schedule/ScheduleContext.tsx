import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Event } from '../types';

type Dictionary = { [key: string]: any };

interface ScheduleContextProps {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  schedule: Dictionary;
  setSchedule: React.Dispatch<React.SetStateAction<Dictionary>>;
  schedScore: number;
  setSchedScore: React.Dispatch<React.SetStateAction<number>>;
}

const ScheduleContext = createContext<ScheduleContextProps | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [schedule, setSchedule] = useState<Dictionary>({});
  const [schedScore, setSchedScore] = useState<number>(0);

  return (
    <ScheduleContext.Provider value={{ events, setEvents, schedule, setSchedule, schedScore, setSchedScore }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  return useContext(ScheduleContext);
};