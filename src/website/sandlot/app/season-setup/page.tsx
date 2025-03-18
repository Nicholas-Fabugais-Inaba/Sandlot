'use client';

import { useState, useEffect } from "react";
import Schedule from "@/app/schedule/schedule"; // Import the schedule page
import { ScheduleProvider } from "@/app/schedule/ScheduleContext"; // Import the ScheduleProvider
import getSeasonSettings from "../functions/getSeasonSettings";
import "./SeasonSetupPage.css";
import updateSeasonSettings from "../functions/updateSeasonSettings";

export default function SeasonSetupPage() {
  const [activeSection, setActiveSection] = useState("general");

  // Individual state variables for form data
  const [seasonName, setSeasonName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [gamesPerTeam, setGamesPerTeam] = useState(0);

  const renderSection = () => {
    switch (activeSection) {
      case "general":
        return (
          <GeneralSettings
            seasonName={seasonName}
            setSeasonName={setSeasonName}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            gamesPerTeam={gamesPerTeam}
            setGamesPerTeam={setGamesPerTeam}
          />
        );
      case "teams":
        return <TeamsSettings />;
      case "schedule":
        return <ScheduleSettings />;
      case "rules":
        return <RulesSettings />;
      default:
        return (
          <GeneralSettings
            seasonName={seasonName}
            setSeasonName={setSeasonName}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            gamesPerTeam={gamesPerTeam}
            setGamesPerTeam={setGamesPerTeam}
          />
        );
    }
  };

  return (
    <ScheduleProvider>
      <div>
        <Toolbar setActiveSection={setActiveSection} />
        <div className="p-6">{renderSection()}</div>
      </div>
    </ScheduleProvider>
  );
}

interface ToolbarProps {
  setActiveSection: (section: string) => void;
}

function Toolbar({ setActiveSection }: ToolbarProps) {
  return (
    <div className="toolbar">
      <button onClick={() => setActiveSection("general")}>General</button>
      <button onClick={() => setActiveSection("teams")}>Teams</button>
      <button onClick={() => setActiveSection("schedule")}>Schedule</button>
      <button onClick={() => setActiveSection("rules")}>Rules</button>
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
}

function GeneralSettings({
  seasonName,
  setSeasonName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  gamesPerTeam,
  setGamesPerTeam
}: GeneralSettingsProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
    let settings = { start_date: startDate, end_date: endDate, games_per_team: gamesPerTeam };
    console.log(settings);
    updateSeasonSettings(settings);
  };

  const isSaveDisabled = !startDate || !endDate || gamesPerTeam <= 0;

  useEffect(() => {
    const loadFormData = async () => {
      const data = await getSeasonSettings();
      if (data.season_name != null) {
        setSeasonName(data.season_name || "");
      }
      if (data.start_date != null) {
        setStartDate(data.start_date || "");
      }
      if (data.end_date != null) {
        setEndDate(data.end_date || "");
      }
      if (data.games_per_team != null) {  
        setGamesPerTeam(data.games_per_team || 0);
      }
    };

    loadFormData();
  }, [setSeasonName, setStartDate, setEndDate, setGamesPerTeam]);

  return (
    <div className="general-settings-container" style={{ width: '50%' }}>
      <h2 className="text-2xl font-semibold mb-4">General Settings</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Season Name</label>
          <input
            type="text"
            name="seasonName"
            value={seasonName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={startDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            value={endDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Number of games played by each team</label>
          <input
            type="number"
            name="gamesPerTeam"
            value={gamesPerTeam}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="flex items-center mb-4">
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg text-white ${isSaveDisabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500'}`}
            onClick={handleSave}
            disabled={isSaveDisabled}
          >
            Save
          </button>
          {isSaveDisabled && (
            <div className="ml-4 text-red-500" style={{ width: '60%' }}>
              Must input valid start date, end date and number of games played by each team before saving
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

function TeamsSettings() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Teams Settings</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Add Team</label>
          <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Team Name" />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Add Team</button>
      </form>
    </div>
  );
}

function ScheduleSettings() {
  return (
    <div>
      <Schedule viewer={true} />
    </div>
  );
}

function RulesSettings() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Rules Settings</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Game Rules</label>
          <textarea className="w-full px-4 py-2 border rounded-lg" rows={5}></textarea>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Save Rules</button>
      </form>
    </div>
  );
}