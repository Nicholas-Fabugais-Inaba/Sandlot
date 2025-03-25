// app/join-a-team/page.tsx

"use client";

import { title } from "@/components/primitives";

import AvailableTeams from "@/app/team/AvailableTeams"; // Import the schedule page
import "./JoinATeam.css";

export default function SchedulePage() {
  return (
    <div>
      <div className="center-container">
        <h1 className={title()}>Join A Team</h1>
      </div>
      <AvailableTeams />
    </div>
  );
}
