import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobalState {
  teamId: number;
  teamName: string;
  setTeamId: (id: number) => void;
  setTeamName: (name: string) => void;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [teamId, setTeamId] = useState<number>(0);
  const [teamName, setTeamName] = useState<string>("");

  return (
    <GlobalStateContext.Provider value={{ teamId, teamName, setTeamId, setTeamName }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};