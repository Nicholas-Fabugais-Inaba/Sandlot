'use client';

import { useState } from "react";
import SchedulePage from "@/app/schedule/page"; // Import the schedule page
import "./CommissionerPage.css";

export default function CommissionerPage() {
  const [activeSection, setActiveSection] = useState("general");

  // State to store form data
  const [formData, setFormData] = useState({
    seasonName: "",
    startDate: "",
    endDate: ""
  });

  const renderSection = () => {
    switch (activeSection) {
      case "general":
        return <GeneralSettings formData={formData} setFormData={setFormData} />;
      case "teams":
        return <TeamsSettings />;
      case "schedule":
        return <ScheduleSettings />;
      case "rules":
        return <RulesSettings />;
      default:
        return <GeneralSettings formData={formData} setFormData={setFormData} />;
    }
  };

  return (
    <div>
      <Toolbar setActiveSection={setActiveSection} />
      <div className="p-6">{renderSection()}</div>
    </div>
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
  formData: {
    seasonName: string;
    startDate: string;
    endDate: string;
  };
  setFormData: (data: { seasonName: string; startDate: string; endDate: string }) => void;
}

function GeneralSettings({ formData, setFormData }: GeneralSettingsProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="general-settings-container" style={{ width: '50%' }}>
      <h2 className="text-2xl font-semibold mb-4">General Settings</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Season Name</label>
          <input
            type="text"
            name="seasonName"
            value={formData.seasonName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Save</button>
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
      <SchedulePage viewer={true} />
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