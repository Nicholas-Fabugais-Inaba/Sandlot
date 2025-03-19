"use client";

"use client";

import { useState, useEffect, useRef } from "react";
import {
  DndProvider,
  useDrag,
  useDrop,
  DragSourceMonitor,
  DropTargetMonitor,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import getSeasonSettings from "../functions/getSeasonSettings";

import "./SeasonSetupPage.css";
import updateSeasonSettings from "../functions/updateSeasonSettings";
import getTeamsSeasonSetup from "../functions/getTeamsSeasonSetup";
import updateTeamDivisions from "../functions/updateTeamDivisions";
import updateDivisions from "../functions/updateDivisions";

import { ScheduleProvider } from "@/app/schedule/ScheduleContext"; // Import the ScheduleProvider
import Schedule from "@/app/schedule/schedule"; // Import the schedule page

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
          />
        );
      case "divisions":
        return (
          <DndProvider backend={HTML5Backend}>
            <DivisionsSettings />
          </DndProvider>
        );
      case "schedule":
        return <ScheduleSettings />;
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
  setGameDays,
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
      game_days: gameDays,
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
    <div className="general-settings-container" style={{ width: "50%" }}>
      <h2 className="text-2xl font-semibold mb-4">General Settings</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Season Name</label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            name="seasonName"
            type="text"
            value={seasonName}
            onChange={handleChange}
          />
        </div>
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

const ItemTypes = {
  TEAM: "team",
};

interface DragItem {
  index: number;
  division_id: number;
}

interface Team {
  id: number;
  name: string;
  preferredDivision: string;
}

interface Division {
  id: number;
  name: string;
  teams: Team[];
}

interface TeamProps {
  team: Team;
  index: number;
  division_id: number;
  moveTeam: (
    dragIndex: number,
    hoverIndex: number,
    sourceDivisionId: number,
    targetDivisionId: number,
  ) => void;
  setIsDragging: (isDragging: boolean) => void; // Add this prop
}

const Team: React.FC<TeamProps> = ({
  team,
  index,
  division_id,
  moveTeam,
  setIsDragging,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TEAM,
    item: { index, division_id },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => setIsDragging(false), // Reset dragging state when drag ends
  });

  useEffect(() => {
    setIsDragging(isDragging);
  }, [isDragging, setIsDragging]);

  drag(ref);

  return (
    <div
      ref={ref}
      className="flex items-center justify-between p-2 border rounded-lg mb-2"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <span>{team.name}</span>
      <span className="text-xs text-gray-500">
        Preferred: {team.preferredDivision}
      </span>
    </div>
  );
};

interface DivisionProps {
  division: Division;
  moveTeam: (
    dragIndex: number,
    hoverIndex: number,
    sourceDivisionId: number,
    targetDivisionId: number,
  ) => void;
  isDragging: boolean; // Add this prop to track dragging state
  setIsDragging: (isDragging: boolean) => void; // Add this prop to set dragging state
}
const Division: React.FC<DivisionProps> = ({
  division,
  moveTeam,
  isDragging,
  setIsDragging,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop<DragItem>({
    accept: ItemTypes.TEAM,
    drop(item: DragItem, monitor: DropTargetMonitor) {
      const hoverIndex = division.teams.length; // Drop at the end of the list if dropped in the overall target

      if (item.division_id !== division.id || item.index !== hoverIndex) {
        moveTeam(item.index, hoverIndex, item.division_id, division.id);
        item.index = hoverIndex;
        item.division_id = division.id;
      }
    },
  });

  drop(ref);

  return (
    <div ref={ref} className="division drop-target">
      <h3>{division.name}</h3>
      {division.teams.length === 0 ||
      (isDragging && division.name !== "Team Bank") ? (
        <div className="empty-division">Drop teams here</div>
      ) : (
        division.teams.map((team, index) => (
          <Team
            key={team.id}
            division_id={division.id}
            index={index}
            moveTeam={moveTeam}
            setIsDragging={setIsDragging} // Pass the setIsDragging callback
            team={team}
          />
        ))
      )}
    </div>
  );
};

function DivisionsSettings() {
  const [isDivisionsEnabled, setIsDivisionsEnabled] = useState<boolean>(true);
  const [divisions, setDivisions] = useState<Division[]>([
    { id: 0, name: "Team Bank", teams: [] },
  ]);
  const [newDivision, setNewDivision] = useState("");
  const [isDragging, setIsDragging] = useState(false); // Lift the dragging state up

  // Load state from localStorage on mount
  useEffect(() => {
    const loadDivisionData = async () => {
      const data = await getTeamsSeasonSetup();

      setDivisions(data);
    };

    loadDivisionData();
  }, []);

  // Toggle divisions on/off
  const toggleDivisions = () => setIsDivisionsEnabled((prev) => !prev);

  // Add a division
  const addDivision = () => {
    if (newDivision.trim() !== "") {
      const newDivisionId =
        divisions.length > 0 ? Math.max(...divisions.map((d) => d.id)) + 1 : 1;

      setDivisions((prev) => [
        ...prev,
        { id: newDivisionId, name: newDivision, teams: [] },
      ]);
      setNewDivision("");
    }
  };

  // Move a team between divisions
  const moveTeam = (
    dragIndex: number,
    hoverIndex: number,
    sourceDivisionId: number,
    targetDivisionId: number,
  ) => {
    if (sourceDivisionId === targetDivisionId) {
      return;
    }

    const sourceDivision = divisions.find(
      (division) => division.id === sourceDivisionId,
    );
    const targetDivision = divisions.find(
      (division) => division.id === targetDivisionId,
    );

    if (!sourceDivision || !targetDivision) {
      return;
    }

    const sourceTeams = [...sourceDivision.teams];
    const [movedTeam] = sourceTeams.splice(dragIndex, 1);
    const targetTeams = [...targetDivision.teams];

    targetTeams.splice(hoverIndex, 0, movedTeam);

    setDivisions((prev) =>
      prev.map((division) =>
        division.id === sourceDivisionId
          ? { ...division, teams: sourceTeams }
          : division.id === targetDivisionId
            ? { ...division, teams: targetTeams }
            : division,
      ),
    );
  };

  // Save divisions to the database
  const saveDivisions = async () => {
    alert("Divisions save button pressed.");
    updateDivisions(divisions);
    updateTeamDivisions(divisions);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Division Settings</h2>

      {/* Toggle to enable/disable divisions */}
      <div className="mb-4 flex items-center">
        <input
          checked={isDivisionsEnabled}
          className="mr-2"
          id="toggleDivisions"
          type="checkbox"
          onChange={toggleDivisions}
        />
        <label className="text-gray-700" htmlFor="toggleDivisions">
          Enable Divisions
        </label>
      </div>

      {isDivisionsEnabled && (
        <div className="flex">
          <div
            className="divisions-container flex-grow"
            style={{ width: "60%" }}
          >
            {/* Add Division */}
            <div className="mb-4 flex">
              <input
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Division Name"
                type="text"
                value={newDivision}
                onChange={(e) => setNewDivision(e.target.value)}
              />
              <button
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                type="button"
                onClick={addDivision}
              >
                Add Division
              </button>
            </div>

            {/* List of Divisions */}
            <div
              className="divisions-list overflow-y-auto"
              style={{ maxHeight: "60vh" }}
            >
              {divisions
                .filter((division) => division.name !== "Team Bank")
                .map((division) => (
                  <div key={division.id} className="division-container">
                    <Division
                      division={division}
                      isDragging={isDragging} // Pass the isDragging state
                      moveTeam={moveTeam}
                      setIsDragging={setIsDragging} // Pass the setIsDragging function
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Team Bank */}
          <div
            className="team-bank-container flex-shrink-0 ml-4"
            style={{ width: "40%", position: "sticky", top: "10px" }}
          >
            <Division
              division={
                divisions.find((division) => division.name === "Team Bank")!
              }
              isDragging={isDragging} // Pass the isDragging state
              moveTeam={moveTeam}
              setIsDragging={setIsDragging} // Pass the setIsDragging function
            />
            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
                type="button"
                onClick={saveDivisions}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
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
