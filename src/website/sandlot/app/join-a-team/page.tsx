// app/join-a-team/page.tsx

"use client";

import { title } from "@/components/primitives";

import AvailableTeams from "@/app/team/AvailableTeams"; // Import the schedule page

export default function SchedulePage() {
  return (
    <div>
    <h1 className={title()}>Join A Team</h1>
      <AvailableTeams />
    </div>
  );
}
