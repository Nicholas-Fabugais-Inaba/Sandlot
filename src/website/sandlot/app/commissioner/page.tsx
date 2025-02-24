// app/commissioner/page.tsx

'use client';

import { useState } from "react";

export default function CommissionerPage() {
  const [activeSection, setActiveSection] = useState("general");

  const renderSection = () => {
    switch (activeSection) {
      case "general":
        return <GeneralSettings />;
      case "teams":
        return <TeamsSettings />;
      case "schedule":
        return <ScheduleSettings />;
      case "rules":
        return <RulesSettings />;
      default:
        return <GeneralSettings />;
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
    <div className="bg-gray-800 text-white p-4 flex justify-around">
      <button onClick={() => setActiveSection("general")} className="px-4 py-2">General</button>
      <button onClick={() => setActiveSection("teams")} className="px-4 py-2">Teams</button>
      <button onClick={() => setActiveSection("schedule")} className="px-4 py-2">Schedule</button>
      <button onClick={() => setActiveSection("rules")} className="px-4 py-2">Rules</button>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">General Settings</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Season Name</label>
          <input type="text" className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Start Date</label>
          <input type="date" className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">End Date</label>
          <input type="date" className="w-full px-4 py-2 border rounded-lg" />
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
      <h2 className="text-2xl font-semibold mb-4">Schedule Settings</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Upload Schedule</label>
          <input type="file" className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Upload</button>
      </form>
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