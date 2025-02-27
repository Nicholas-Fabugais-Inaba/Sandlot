'use client';

import { useState, useEffect } from "react";
import SchedulePage from "@/app/schedule/page"; // Import the schedule page
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
  const [gameDays, setGameDays] = useState<string[]>([]);

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
            gameDays={gameDays}
            setGameDays={setGameDays}
          />
        );
      case "divisions":
        return <DivisionsSettings />;
      case "schedule":
        return <ScheduleSettings />;
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
            gameDays={gameDays}
            setGameDays={setGameDays}
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
      <button onClick={() => setActiveSection("divisions")}>Divisions</button>
      <button onClick={() => setActiveSection("schedule")}>Schedule</button>
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
  setGameDays
}: GeneralSettingsProps) {

  const toggleGameDay = (day: string) => {
    setGameDays((prevDays: string[]) => {
      console.log("Previous state:", prevDays);
      const updatedDays = prevDays.includes(day)
      ? prevDays.filter((d) => d !== day)
      : [...prevDays, day];
      console.log("Updated state:", updatedDays);
      return updatedDays;
    });
  };

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
    const settings = { 
      season_name: seasonName,
      start_date: startDate, 
      end_date: endDate, 
      games_per_team: gamesPerTeam,
      game_days: gameDays 
    };
    console.log(settings);
    updateSeasonSettings(settings);
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
        <div className="mb-4">
          <label className="block text-gray-700">Game Days</label>
          <div className="grid grid-cols-4 gap-2">
            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
              <label key={day} className="flex items-center">
                <input
                  type="checkbox"
                  checked={gameDays.includes(day)}
                  onChange={() => toggleGameDay(day)}
                  className="mr-2"
                />
                {day}
              </label>
            ))}
          </div>
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

function DivisionsSettings() {
  const [isDivisionsEnabled, setIsDivisionsEnabled] = useState<boolean>(false);
  const [divisions, setDivisions] = useState<string[]>([]);
  const [newDivision, setNewDivision] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");

  // Load state from localStorage on mount
  useEffect(() => {
    const storedDivisionsEnabled = localStorage.getItem("divisionsEnabled");
    if (storedDivisionsEnabled !== null) {
      setIsDivisionsEnabled(storedDivisionsEnabled === "true"); // Convert string to boolean
    }

    const storedDivisions = localStorage.getItem("divisions");
    if (storedDivisions) {
      try {
        setDivisions(JSON.parse(storedDivisions));
      } catch {
        console.error("Failed to parse divisions from localStorage");
      }
    }
  }, []);

  // Save divisionsEnabled state to localStorage when changed
  useEffect(() => {
    localStorage.setItem("divisionsEnabled", isDivisionsEnabled.toString());
  }, [isDivisionsEnabled]);

  // Save divisions list to localStorage when changed
  useEffect(() => {
    localStorage.setItem("divisions", JSON.stringify(divisions));
  }, [divisions]);

  // Toggle divisions on/off
  const toggleDivisions = () => setIsDivisionsEnabled((prev) => !prev);

  // Add a division
  const addDivision = () => {
    if (newDivision.trim() !== "") {
      setDivisions((prev) => [...prev, newDivision]);
      setNewDivision("");
    }
  };

  // Start editing a division
  const startEditing = (index: number, name: string) => {
    setEditingIndex(index);
    setEditedName(name);
  };

  // Save edited division name
  const saveEdit = (index: number) => {
    const updatedDivisions = [...divisions];
    updatedDivisions[index] = editedName;
    setDivisions(updatedDivisions);
    setEditingIndex(null);
  };

  // Delete a division
  const deleteDivision = (index: number) => {
    setDivisions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Divisions Settings</h2>

      {/* Toggle to enable/disable divisions */}
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="toggleDivisions"
          checked={isDivisionsEnabled}
          onChange={toggleDivisions}
          className="mr-2"
        />
        <label htmlFor="toggleDivisions" className="text-gray-700">
          Enable Divisions
        </label>
      </div>

      {isDivisionsEnabled && (
        <div>
          {/* Add Division */}
          <div className="mb-4 flex">
            <input
              type="text"
              value={newDivision}
              onChange={(e) => setNewDivision(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Division Name"
            />
            <button
              type="button"
              onClick={addDivision}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Add Division
            </button>
          </div>

          {/* List of Divisions */}
          <ul>
            {divisions.map((division, index) => (
              <li key={index} className="flex items-center justify-between p-2 border rounded-lg mb-2">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full px-2 py-1 border rounded-lg"
                  />
                ) : (
                  <span>{division}</span>
                )}

                <div className="ml-2 flex">
                  {editingIndex === index ? (
                    <button
                      onClick={() => saveEdit(index)}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg mr-2"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditing(index, division)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-lg mr-2"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deleteDivision(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ScheduleSettings() {
  return (
    <div>
      <SchedulePage viewer={true} />
    </div>
  );
}
