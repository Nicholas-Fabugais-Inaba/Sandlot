import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobalState {
  teamId: number | undefined;
  teamName: string | undefined;
  setTeamId: (id: number | undefined) => void;
  setTeamName: (name: string | undefined) => void;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

const getInitialTeamId = () => {
  if (typeof window !== "undefined") {
    const savedTeamId = localStorage.getItem("teamId");
    return savedTeamId ? Number(savedTeamId) : undefined;
  }
  return undefined;
};

const getInitialTeamName = () => {
  if (typeof window !== "undefined") {
    const savedTeamName = localStorage.getItem("teamName");
    return savedTeamName || undefined;
  }
  return undefined;
};

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [teamId, setTeamIdState] = useState<number | undefined>(getInitialTeamId);
  const [teamName, setTeamNameState] = useState<string | undefined>(getInitialTeamName);

  const setTeamId = (id: number | undefined) => {
    setTeamIdState(id);
    if (typeof window !== "undefined") {
      if (id !== undefined) {
        localStorage.setItem("teamId", id.toString());
      } else {
        localStorage.removeItem("teamId");
      }
    }
  };

  const setTeamName = (name: string | undefined) => {
    setTeamNameState(name);
    if (typeof window !== "undefined") {
      if (name !== undefined) {
        localStorage.setItem("teamName", name);
      } else {
        localStorage.removeItem("teamName");
      }
    }
  };

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