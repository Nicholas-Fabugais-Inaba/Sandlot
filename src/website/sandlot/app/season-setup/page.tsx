"use client";

import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation"; 
import { getSession } from "next-auth/react";
import { Session } from "next-auth";

import getSeasonSettings from "../functions/getSeasonSettings";
import updateSeasonSettings from "../functions/updateSeasonSettings";

import "./SeasonSetupPage.css";

import { ScheduleProvider } from "@/app/schedule/ScheduleContext";
import Schedule from "@/app/schedule/schedule";

import DivisionsSettings from "./DivisionsSettings";
import Launchpad from "./Launchpad";
import getSeasonState from "../functions/getSeasonState";
import getAllTimeslots from "../functions/getAllTimeslots";

// Define interfaces for the new data structures
interface Timeslot {
  id: number;
  startTime: string;
  endTime: string;
}

interface Field {
  id: number;
  name: string;
  timeslotIds: number[];
}

export default function SeasonSetupPage() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  const [activeSection, setActiveSection] = useState("general");
  const [seasonState, setSeasonState] = useState("preseason");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  // Updated state variables
  const [seasonName, setSeasonName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [gamesPerTeam, setGamesPerTeam] = useState(0);
  const [gameDays, setGameDays] = useState<string[]>([]);
  
  // New state for fields and timeslots
  const [fields, setFields] = useState<Field[]>([]);
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);

  useEffect(() => {
    const fetchSeasonState = async () => {
      const session = await getSession();
      setSession(session);

      if (!session || session?.user.role !== "commissioner") {
        router.push("/");
        return;
      } else {
        const state = await getSeasonState();
        console.log("Season State is", state)
        setSeasonState(state);
        setLoading(false);
      }
    };

    fetchSeasonState();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Spinner label="Loading Season Setup..." size="lg" />
      </div>
    );
  }

  const scheduleDesc = <p className="mb-4">Generating a schedule isn't available until preseason is launched.</p>;

  const renderSection = () => {
    switch (activeSection) {
      case "general":
        return (
          <GeneralSettings
            endDate={endDate}
            gameDays={gameDays}
            gamesPerTeam={gamesPerTeam}
            fields={fields}
            setFields={setFields}
            timeslots={timeslots}
            setTimeslots={setTimeslots}
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
            fields={fields}
            setFields={setFields}
            timeslots={timeslots}
            setTimeslots={setTimeslots}
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
  fields: Field[];
  setFields: React.Dispatch<React.SetStateAction<Field[]>>;
  timeslots: Timeslot[];
  setTimeslots: React.Dispatch<React.SetStateAction<Timeslot[]>>;
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
  fields,
  setFields,
  timeslots,
  setTimeslots,
  seasonState,
  setUnsavedChanges,
}: GeneralSettingsProps) {
  const toggleGameDay = (day: string) => {
    setGameDays((prevDays: string[]) => {
      const updatedDays = prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day];

      setUnsavedChanges(true);
      return updatedDays;
    });
  };

  const addTimeslot = () => {
    if (timeslots.length >= 30) {
      alert("You can only create up to 30 timeslots.");
      return;
    }

    const newTimeslot: Timeslot = {
      id: timeslots.length + 1, // Generate ID within the range 1 to len(timeslots)
      startTime: '17:00', // Default to 5:00 PM
      endTime: '18:00' // Default to 6:00 PM
    };
    setTimeslots(prev => [...prev, newTimeslot]);
    setUnsavedChanges(true);
  };

  // Update Timeslot Function
  const updateTimeslot = (id: number, field: 'startTime' | 'endTime', value: string) => {
    const [hour, minute] = value.split(":").map(Number);
  
    // Validate start and end times
    if (field === "startTime" && (hour < 5 || hour > 23)) {
      alert("Start time must be between 5:00 AM and 11:59 PM.");
      return;
    }
    if (field === "endTime" && (hour < 5 && hour !== 0 || hour > 23 || (hour === 0 && minute > 0))) {
      alert("End time must be between 5:00 AM and 12:00 AM.");
      return;
    }
  
    // Update the timeslot in the state
    setTimeslots(prev =>
      prev.map(timeslot =>
        timeslot.id === id
          ? { ...timeslot, [field]: value }
          : timeslot
      )
    );
    console.log("Updated timeslot", id, field, value);
    setUnsavedChanges(true);
  };

  // Remove Timeslot Function
  const removeTimeslot = (id: number) => {
    setTimeslots(prev => {
      const updatedTimeslots = prev.filter(timeslot => timeslot.id !== id);
      // Reassign IDs to ensure they remain sequential
      return updatedTimeslots.map((timeslot, index) => ({
        ...timeslot,
        id: index + 1
      }));
    });
  
    // Also update timeslot IDs in fields
    setFields(prev =>
      prev.map(field => ({
        ...field,
        timeslotIds: field.timeslotIds.filter(tsId => tsId !== id)
      }))
    );
  
    setUnsavedChanges(true);
  };

  // Add Field Function
  const addField = () => {
    if (fields.length >= 3) {
      alert("You can only create up to 3 fields.");
      return;
    }
  
    const newField: Field = {
      id: fields.length + 1, // Assign ID based on the current number of fields
      name: `Field ${fields.length + 1}`,
      timeslotIds: [],
    };
  
    setFields((prev) => {
      const updatedFields = [...prev, newField];
      // Reassign IDs to ensure they remain sequential
      return updatedFields.map((field, index) => ({
        ...field,
        id: index + 1, // Reassign IDs starting from 1
      }));
    });
  
    setUnsavedChanges(true);
  };

  // Update Field Name Function
  const updateFieldName = (id: number, name: string) => {
    setFields(prev => 
      prev.map(field => 
        field.id === id 
          ? { ...field, name }
          : field
      )
    );
    setUnsavedChanges(true);
  };

  // Toggle Timeslot for Field
  const toggleTimeslotForField = (fieldId: number, timeslotId: number) => {
    setFields(prev =>
      prev.map(field => {
        if (field.id === fieldId) {
          const selectedTimeslot = timeslots.find(ts => ts.id === timeslotId);
          if (!selectedTimeslot) return field;
  
          const isToggled = field.timeslotIds.includes(timeslotId);
  
          // If toggling off, allow it without checking for overlaps
          if (isToggled) {
            const updatedTimeslotIds = field.timeslotIds.filter(id => id !== timeslotId);
            return { ...field, timeslotIds: updatedTimeslotIds };
          }
  
          // Check for overlapping timeslots if toggling on
          const hasOverlap = field.timeslotIds.some(id => {
            const existingTimeslot = timeslots.find(ts => ts.id === id);
            if (!existingTimeslot) return false;
  
            const selectedStart = new Date(`1970-01-01T${selectedTimeslot.startTime}:00`);
            const selectedEnd = new Date(`1970-01-01T${selectedTimeslot.endTime}:00`);
            const existingStart = new Date(`1970-01-01T${existingTimeslot.startTime}:00`);
            const existingEnd = new Date(`1970-01-01T${existingTimeslot.endTime}:00`);
  
            return (
              selectedStart < existingEnd && selectedEnd > existingStart // Overlap condition
            );
          });
  
          if (hasOverlap) {
            // alert("This timeslot overlaps with an existing timeslot for this field.");
            return field; // Do not toggle the timeslot
          }
  
          // Toggle the timeslot if no overlap
          const updatedTimeslotIds = [...field.timeslotIds, timeslotId];
          return { ...field, timeslotIds: updatedTimeslotIds };
        }
        return field;
      })
    );
  
    setUnsavedChanges(true);
  };

  // Remove Field Function
  const removeField = (id: number) => {
    setFields(prev => {
      const updatedFields = prev.filter(field => field.id !== id);
      // Reassign IDs to ensure they remain sequential
      return updatedFields.map((field, index) => ({
        ...field,
        id: index + 1
      }));
    });

    setUnsavedChanges(true);
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
      // season_name: seasonName,
      start_date: startDate,
      end_date: endDate,
      games_per_team: gamesPerTeam,
      game_days: gameDays,
      fields: fields,
      timeslots: timeslots.map((timeslot) => ({
        ...timeslot,
        startTime: convertTimeToUTC(timeslot.startTime), // Convert to HH-MM
        endTime: convertTimeToUTC(timeslot.endTime), // Convert to HH-MM
      })),
    };
  
    console.log(settings);
    updateSeasonSettings(settings);
    setUnsavedChanges(false);
  };

  // Check if save can be done
  const isSaveDisabled = 
    !startDate ||
    !endDate ||
    gamesPerTeam <= 0 ||
    fields.length === 0 ||
    timeslots.length === 0 ||
    timeslots.some(ts => !ts.startTime || !ts.endTime) ||
    fields.some(field => field.timeslotIds.length === 0) ||
    timeslots.some(ts => {
      const normalizeTime = (time: string) => {
        const [hour, minute] = time.split(":").map(Number);
        return hour === 0 ? 24 * 60 + minute : hour * 60 + minute; // Treat 12:00 AM as 24:00
      };

      const start = normalizeTime(ts.startTime);
      const end = normalizeTime(ts.endTime);
      const diffInMinutes = end - start; // Calculate difference in minutes

      return start >= end || diffInMinutes < 30; // Check if start is not earlier than end or difference is less than 30 minutes
    });

  const invalidTimeslotMessage = timeslots.some(ts => {
    const normalizeTime = (time: string) => {
      const [hour, minute] = time.split(":").map(Number);
      return hour === 0 ? 24 * 60 + minute : hour * 60 + minute; // Treat 12:00 AM as 24:00
    };
  
    const start = normalizeTime(ts.startTime);
    const end = normalizeTime(ts.endTime);
    const diffInMinutes = end - start;
  
    return start >= end || diffInMinutes < 30;
  })
    ? "One or more timeslots have a start time that is not earlier than the end time or have less than a 30-minute duration."
    : "";

  useEffect(() => {
    const loadFormData = async () => {
      const data = await getSeasonSettings();
      const timeslotData = await getAllTimeslots();
  
      // Deduplicate timeslots based on start and end times
      const timeslotMap = new Map<string, Timeslot & { fieldIds: number[] }>();
  
      timeslotData.forEach((timeslot: any) => {
        const key = `${timeslot.start}-${timeslot.end}`; // Use start and end times as the unique key
        if (!timeslotMap.has(key)) {
          timeslotMap.set(key, {
            id: timeslotMap.size + 1, // Generate a unique ID for the deduplicated timeslot
            startTime: convertUTCToTime(timeslot.start), // Convert UTC format to HH:MM
            endTime: convertUTCToTime(timeslot.end), // Convert UTC format to HH:MM
            fieldIds: [timeslot.field_id], // Initialize with the current field_id
          });
        } else {
          // Add the field_id to the existing timeslot's fieldIds
          timeslotMap.get(key)!.fieldIds.push(timeslot.field_id);
        }
      });
  
      // Convert the Map to an array of timeslots
      const timeslots = Array.from(timeslotMap.values())
        .map(({ fieldIds, ...rest }) => rest)
        .sort((a, b) => {
          const [aHour, aMinute] = a.startTime.split(":").map(Number);
          const [bHour, bMinute] = b.startTime.split(":").map(Number);
          return aHour === bHour ? aMinute - bMinute : aHour - bHour; // Compare hours, then minutes
        });
  
      // Group timeslots by field
      const fields = Array.from(timeslotMap.values()).reduce((acc: Field[], timeslot) => {
        timeslot.fieldIds.forEach((fieldId) => {
          const existingField = acc.find((field) => field.id === fieldId);
          if (existingField) {
            existingField.timeslotIds.push(timeslot.id);
          } else {
            acc.push({
              id: fieldId,
              name: timeslotData.find((ts: any) => ts.field_id === fieldId)?.field_name || `Field ${fieldId}`,
              timeslotIds: [timeslot.id],
            });
          }
        });
        return acc;
      }, []);
  
      setSeasonName(data.season_name || "");
      setStartDate(data.start_date || "");
      setEndDate(data.end_date || "");
      setGamesPerTeam(data.games_per_team || 0);
      setGameDays(data.game_days || []);
      setFields(fields);
      setTimeslots(timeslots);
    };
  
    loadFormData();
  }, [
    setSeasonName,
    setStartDate,
    setEndDate,
    setGamesPerTeam,
    setGameDays,
    setFields,
    setTimeslots,
  ]);

  const convertUTCToTime = (utcTime: string): string => {
    const [hour, minute] = utcTime.split("-").map(Number);
  
    // Subtract 4 hours to adjust for the offset
    const adjustedHour = (hour - 4 + 24) % 24; // Ensure the hour stays within 0-23
    const formattedHour = adjustedHour.toString().padStart(2, "0");
    const formattedMinute = minute.toString().padStart(2, "0");
  
    return `${formattedHour}:${formattedMinute}`;
  };

  const convertTimeToUTC = (time: string): string => {
    let [hour, minute] = time.split(":").map(Number);
    if (hour < 4) {
      hour += 24; // Adjust for UTC conversion (example: +4 hours)
    }
    const utcHour = hour + 4; // Adjust for UTC conversion (example: +4 hours)
    return `${utcHour}-${minute}`;
  };

  const seasonDesc = seasonState === "offseason" 
    ? "The season is currently in the offseason. You can prepare for the upcoming season by setting up dates, fields, and timeslots."
    : seasonState === "preseason"
    ? "The season is currently in the preseason. Configure your fields and timeslots before generating the schedule."
    : "The season is currently active. Monitor the progress and make adjustments as needed.";

  return (
    <div className="general-settings-container">
      <h2 className="text-2xl font-semibold mb-4">General Settings</h2>
      <h3 className="text-1xl text-gray-700 mb-4">
        Season Status: <span className="font-bold text-gray-900">
          {seasonState === "offseason" ? "Offseason" : 
           seasonState === "preseason" ? "Preseason" : 
           "Season Active"}
        </span>
      </h3>
      <p className="mb-4">{seasonDesc}</p>
      
      <form>
        {/* Date and Games Settings */}
        <div className="flex mb-4 space-x-4">
          <div className="flex-1">
            <label className="block text-gray-700">Start Date</label>
            <input
              className="w-full px-4 py-2 border rounded-lg"
              name="startDate"
              type="date"
              value={startDate}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700">End Date</label>
            <input
              className="w-full px-4 py-2 border rounded-lg"
              name="endDate"
              type="date"
              value={endDate}
              onChange={handleChange}
            />
          </div>
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

        {/* Game Days */}
        {/* <div className="mb-4">
          <label className="block text-gray-700">Game Days</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              "Sunday", "Monday", "Tuesday", "Wednesday", 
              "Thursday", "Friday", "Saturday"
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
        </div> */}

        {/* Timeslots Section */}
        <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-gray-700">Timeslots</label>
          <button
            type="button"
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={addTimeslot}
          >
            Add Timeslot
          </button>
        </div>
        {timeslots.length === 0 ? (
          <p className="text-gray-500 italic">No Timeslots</p>
        ) : (
          timeslots.map((timeslot) => (
            <div key={timeslot.id} className="flex items-center space-x-2 mb-2">
              <input
                type="time"
                value={timeslot.startTime}
                onChange={(e) => updateTimeslot(timeslot.id, "startTime", e.target.value)}
                className="border rounded px-2 py-1"
              />
              <input
                type="time"
                value={timeslot.endTime}
                onChange={(e) => updateTimeslot(timeslot.id, "endTime", e.target.value)}
                className="border rounded px-2 py-1"
              />
              <button
                type="button"
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => removeTimeslot(timeslot.id)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

        {/* Fields Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700">Fields</label>
            <button
              type="button"
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={addField}
            >
              Add Field
            </button>
          </div>
          {fields.length === 0 ? (
            <p className="text-gray-500 italic">No Fields</p>
          ) : (
            fields.map((field) => (
              <div key={field.id} className="mb-3 p-3 border rounded">
                <div className="flex justify-between items-center mb-2">
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => updateFieldName(field.id, e.target.value)}
                    className="border rounded px-2 py-1 flex-grow mr-2"
                  />
                  <button
                    type="button"
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => removeField(field.id)}
                  >
                    Remove Field
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Timeslots
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeslots
                      .slice() // Create a shallow copy to avoid mutating the original array
                      .sort((a, b) => {
                        const [aHour, aMinute] = a.startTime.split(":").map(Number);
                        const [bHour, bMinute] = b.startTime.split(":").map(Number);
                        return aHour === bHour ? aMinute - bMinute : aHour - bHour; // Compare hours, then minutes
                      })
                      .map((timeslot) => (
                        <label key={timeslot.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={field.timeslotIds.includes(timeslot.id)}
                            onChange={() => toggleTimeslotForField(field.id, timeslot.id)}
                            className="mr-2"
                          />
                          {timeslot.startTime} - {timeslot.endTime}
                        </label>
                      ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Save Button */}
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
              {invalidTimeslotMessage || (
                "Must input valid start/end dates, games per team, at least one field and timeslot, and ensure all timeslots have start/end times and fields have assigned timeslots."
              )}
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
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Schedule Generator</h2>
      <Schedule viewer={true} setUnsavedChanges={setUnsavedChanges} />
    </div>
  );
}
