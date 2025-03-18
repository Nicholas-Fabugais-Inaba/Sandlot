// app/schedule/schedule.tsx

"use client";

import Schedule from "@/app/schedule/schedule"; // Import the schedule page
import "./SchedulePage.css"; // Custom styles

export default function SchedulePage() {
  return (
    <div>
      <Schedule viewer={false} />
    </div>
  );
}
