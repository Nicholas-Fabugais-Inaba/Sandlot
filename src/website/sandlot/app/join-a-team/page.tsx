// app/join-a-team/page.tsx

"use client";

import { title } from "@/components/primitives";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { useState, useEffect } from "react";
import { Spinner } from "@heroui/react";


import AvailableTeams from "@/app/team/AvailableTeams"; // Import the schedule page
import "./JoinATeam.css";
import getSeasonState from "@/app/functions/getSeasonState";


export default function JoinATeamPage() {

  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {

      let response = await getSeasonState();

      const session = await getSession();
      setSession(session);
      
      if ((!session || (session?.user.role !== "player")) || response === "offseason") {
        router.push("/");
        return;
      } 
      setLoading(false);

    };

    fetchSession();
  }
  , []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Spinner label="Loading Team Information..." size="lg" />
      </div>
    );
  }

  return (
    <div className="pageHeader">
      <h1 className={title()}>Join A Team</h1>
      <AvailableTeams />
    </div>
  );
}
