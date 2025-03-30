// app/schedule/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

import getSeasonState from "@/app/functions/getSeasonState";
import Schedule from "@/app/schedule/schedule"; // Import the schedule page
import "./SchedulePage.css"; // Custom styles
import OffseasonMessage from "@/app/no-season/OffseasonMessage";
import PreseasonMessage from "@/app/no-season/PresasonMessage";

export default function SchedulePage() {

  const [seasonState, setSeasonState] = useState<any>();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSeasonState = async () => {
      let response = await getSeasonState();
      setSeasonState(response);

      const session = await getSession();
      setSession(session);
    }

    fetchSeasonState();
  }, []);

  if (seasonState === "offseason" && session?.user.role !== "commissioner") {
    return <OffseasonMessage />;
  }
  else if (seasonState === "preseason" && session?.user.role !== "commissioner") {
    return <PreseasonMessage />;
  }

  return (
    <div>
      <Schedule viewer={false} />
    </div>
  );
}
