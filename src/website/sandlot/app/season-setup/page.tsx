"use client";

import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import getSeasonSettings from "../functions/getSeasonSettings";

import "./SeasonSetupPage.css";
import updateSeasonSettings from "../functions/updateSeasonSettings";

import { ScheduleProvider } from "@/app/schedule/ScheduleContext";
import Schedule from "@/app/schedule/schedule";

import DivisionsSettings from "./DivisionsSettings";
import Launchpad from "./Launchpad";

export default function SeasonSetupPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [seasonState, setSeasonState] = useState("offseason");
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Individual state variables for form data
  const [seasonName, setSeasonName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [gamesPerTeam, setGamesPerTeam] = useState(0);
  const [gameDays, setGameDays] = useState<string[]>([]);

  const scheduleDesc = <p className="mb-4">Generating a schedule isn't available until preseason is launched.</p>

  const renderSection = () => {
    switch (activeSection) {
      case "general":
        return (
          <GeneralSettings
            endDate={endDate}
            gameDays={gameDays}
            gamesPerTeam={gamesPerTeam}
            seasonName={seasonName}
            setEndDate={setEndDate}
            setGameDays={setGameDays}
            setGamesPerTeam={setGamesPerTeam}
            setSeasonName={setSeasonName}
            setStartDate={setStartDate}
            startDate={startDate}
            seasonState={seasonState}
            setUnsavedChanges={setUnsavedChanges}
          />
        );
      case "divisions":
        return (
          <DndProvider backend={HTML5Backend}>
            <DivisionsSettings setUnsavedChanges={setUnsavedChanges} />
          </DndProvider>
        );
      case "schedule":
        return seasonState === "offseason" ? scheduleDesc : <ScheduleSettings setUnsavedChanges={setUnsavedChanges} />;
      case "launchpad":
        return <Launchpad seasonState={seasonState} />;
      default:
        return (
          <GeneralSettings
            endDate={endDate}
            gameDays={gameDays}
            gamesPerTeam={gamesPerTeam}
            seasonName={seasonName}
            setEndDate={setEndDate}
            setGameDays={setGameDays}
            setGamesPerTeam={setGamesPerTeam}
            setSeasonName={setSeasonName}
            setStartDate={setStartDate}
            startDate={startDate}
            seasonState={seasonState}
            setUnsavedChanges={setUnsavedChanges}
          />
        );
    }
  };

  const handleSetActiveSection = (section: string) => {
    if (unsavedChanges) {
      if (window.confirm("You may have unsaved changes. Are you sure you want to switch sections?")) {
        setActiveSection(section);
        setUnsavedChanges(false);
      }
    } else {
      setActiveSection(section);
    }
  };

  return (
    <ScheduleProvider>
      <div>
        <Toolbar setActiveSection={handleSetActiveSection} seasonState={seasonState} />
        <div className="p-6">{renderSection()}</div>
      </div>
    </ScheduleProvider>
  );
}

interface ToolbarProps {
  setActiveSection: (section: string) => void;
  seasonState: string;
}

function Toolbar({ setActiveSection, seasonState }: ToolbarProps) {
  return (
    <div className="toolbar">
      <button onClick={() => setActiveSection("general")}>General</button>
      <button onClick={() => setActiveSection("divisions")}>Divisions</button>
      <button onClick={() => setActiveSection("schedule")}>Schedule</button>
      <button onClick={() => setActiveSection("launchpad")}>
        {seasonState === "offseason" ? "Launch Preseason" : seasonState === "preseason" ? "Launch Season" : "End Season"}
      </button>
    </div>
  );
}

interface GeneralSettingsProps {
  seasonName: string;
  setSeasonName: (name: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  gamesPerTeam: number;
  setGamesPerTeam: (games: number) => void;
  gameDays: string[];
  setGameDays: React.Dispatch<React.SetStateAction<string[]>>;
  seasonState: string;
  setUnsavedChanges: (hasChanges: boolean) => void;
}

function GeneralSettings({
  seasonName,
  setSeasonName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  gamesPerTeam,
  setGamesPerTeam,
  gameDays,
  setGameDays,
  seasonState,
  setUnsavedChanges,
}: GeneralSettingsProps) {
  const toggleGameDay = (day: string) => {
    setGameDays((prevDays: string[]) => {
      console.log("Previous state:", prevDays);
      const updatedDays = prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day];

      console.log("Updated state:", updatedDays);

      setUnsavedChanges(true);
      return updatedDays;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUnsavedChanges(true);

    switch (name) {
      case "seasonName":
        setSeasonName(value);
        break;
      case "startDate":
        setStartDate(value);
        break;
      case "endDate":
        setEndDate(value);
        break;
      case "gamesPerTeam":
        setGamesPerTeam(Number(value));
        break;
      default:
        break;
    }
  };

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const settings = {
      season_name: seasonName,
      start_date: startDate,
      end_date: endDate,
      games_per_team: gamesPerTeam,
      game_days: gameDays,
    };

    console.log(settings);
    updateSeasonSettings(settings);
    setUnsavedChanges(false);
  };

  const isSaveDisabled = !startDate || !endDate || gamesPerTeam <= 0;

  useEffect(() => {
    const loadFormData = async () => {
      const data = await getSeasonSettings();

      setSeasonName(data.season_name || "");
      setStartDate(data.start_date || "");
      setEndDate(data.end_date || "");
      setGamesPerTeam(data.games_per_team || 0);
      setGameDays(data.game_days || []);
    };

    loadFormData();
  }, [setSeasonName, setStartDate, setEndDate, setGamesPerTeam, setGameDays]);

  const seasonDesc = seasonState === "offseason" 
    ? "The season is currently in the offseason. You can prepare for the upcoming season by setting up dates and divisions. Once these settings are set up the preseason can be launched, which will allow the creation of team accounts. All settings changed in the offseason can be changed in the preseason as well."
    : seasonState === "preseason"
    ? "The season is currently in the preseason. Once all team accounts are made, divisions can be assigned and a schedule can be generated. Once a schedule is made the season is ready to launch."
    : "The season is currently active. Monitor the progress and make adjustments as needed.";

  return (
    <div className="general-settings-container" style={{ width: "50%" }}>
      <h2 className="text-2xl font-semibold mb-4">General Settings</h2>
      <h3 className="text-1xl text-gray-700 mb-4">Season Status: <span className="font-bold text-gray-900">{seasonState === "offseason" ? "Offseason" : seasonState === "preseason" ? "Preseason" : "Season Active"}</span></h3>
      <p className="mb-4">{seasonDesc}</p>
      <form>
        {/* <div className="mb-4">
          <label className="block text-gray-700">Season Name</label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            name="seasonName"
            type="text"
            value={seasonName}
            onChange={handleChange}
          />
        </div> */}
        <div className="mb-4">
          <label className="block text-gray-700">Start Date</label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            name="startDate"
            type="date"
            value={startDate}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">End Date</label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            name="endDate"
            type="date"
            value={endDate}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Number of games played by each team
          </label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            name="gamesPerTeam"
            type="number"
            value={gamesPerTeam}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Game Days</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].map((day) => (
              <label key={day} className="flex items-center">
                <input
                  checked={gameDays.includes(day)}
                  className="mr-2"
                  type="checkbox"
                  onChange={() => toggleGameDay(day)}
                />
                {day}
              </label>
            ))}
          </div>
        </div>
        <div className="flex items-center mb-4">
          <button
            className={`px-4 py-2 rounded-lg text-white ${isSaveDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500"}`}
            disabled={isSaveDisabled}
            type="submit"
            onClick={handleSave}
          >
            Save
          </button>
          {isSaveDisabled && (
            <div className="ml-4 text-red-500" style={{ width: "60%" }}>
              Must input valid start date, end date and number of games played
              by each team before saving
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

interface ScheduleSettingsProps {
  setUnsavedChanges: (hasChanges: boolean) => void;
}

function ScheduleSettings({ setUnsavedChanges }: ScheduleSettingsProps) {
  // Your ScheduleSettings component logic here
  // Call setUnsavedChanges(true) whenever there are unsaved changes
  return (
    <div>
      <Schedule viewer={true} setUnsavedChanges={setUnsavedChanges} />
    </div>
  );
}