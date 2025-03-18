import React, { createContext, useState, useContext, ReactNode } from "react";
import { Event } from "../types";

type Dictionary = { [key: string]: any };

interface ScheduleContextProps {
  events: Event[] | null;
  setEvents: React.Dispatch<React.SetStateAction<Event[] | null>>;
  schedule: Dictionary | null;
  setSchedule: React.Dispatch<React.SetStateAction<Dictionary | null>>;
  schedScore: number | null;
  setSchedScore: React.Dispatch<React.SetStateAction<number | null>>;
}

const ScheduleContext = createContext<ScheduleContextProps | undefined>(
  undefined,
);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [schedule, setSchedule] = useState<Dictionary | null>(null);
  const [schedScore, setSchedScore] = useState<number | null>(null);

  return (
    <ScheduleContext.Provider
      value={{
        events,
        setEvents,
        schedule,
        setSchedule,
        schedScore,
        setSchedScore,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  return useContext(ScheduleContext);
};
