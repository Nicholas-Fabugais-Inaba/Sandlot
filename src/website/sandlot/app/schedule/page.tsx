// app/schedule/page.tsx

"use client";

import React, { useState, useEffect } from "react";

import getSeasonState from "@/app/functions/getSeasonState";
import Schedule from "@/app/schedule/schedule"; // Import the schedule page
import "./SchedulePage.css"; // Custom styles
import OffseasonMessage from "@/app/no-season/OffseasonMessage";
import PreseasonMessage from "@/app/no-season/PresasonMessage";

export default function SchedulePage() {

  const [seasonState, setSeasonState] = useState<any>();

  useEffect(() => {
    const fetchSeasonState = async () => {
      let response = await getSeasonState();
      setSeasonState(response);
    }
    fetchSeasonState();
  }, []);

  if (seasonState === "offseason") {
    return <OffseasonMessage />;
  }
  else if (seasonState === "preseason") {
    return <PreseasonMessage />;
  }

  return (
    <div>
      <Schedule viewer={false} />
    </div>
  );
}
