// app/accept-reschedule-request/page.tsx

"use client";

import { useState, useEffect } from "react";
import { getSession } from 'next-auth/react';
import { title } from "@/components/primitives";
import { Card } from "@heroui/react";  // Import NextUI Card
import "./AcceptRescheduleRequest.css";  // Custom styles

interface RescheduleRequest {
  id: string;
  originalDate: Date;
  proposedDates: Date[];
  home: string;
  away: string;
}

export default function AcceptRescheduleRequest() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [rescheduleRequest, setRescheduleRequest] = useState<RescheduleRequest | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Fetch session data to get user role
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        setUserRole(session.user?.role || null);
      }
      setLoading(false); // Set loading to false after fetching session
    };

    fetchSession();
  }, []);

  // Fetch reschedule request data (mocked for this example)
  useEffect(() => {
    const fetchRescheduleRequest = async () => {
      // Replace with actual API call to fetch reschedule request data
      const request: RescheduleRequest = {
        id: "1",
        originalDate: new Date("2025-05-10T17:00:00"),
        proposedDates: [
          new Date("2025-05-12T17:00:00"),
          new Date("2025-05-14T17:00:00"),
          new Date("2025-05-16T17:00:00"),
        ],
        home: "Yankees",
        away: "Mariners",
      };
      setRescheduleRequest(request);
    };

    fetchRescheduleRequest();
  }, []);

  const handleAccept = () => {
    if (selectedDate) {
      // Implement the logic to accept the reschedule request
      alert(`Reschedule request accepted for ${selectedDate.toLocaleString()}`);
    } else {
      alert("Please select a date.");
    }
  };

  const handleDeny = () => {
    // Implement the logic to deny the reschedule request
    alert("Reschedule request denied.");
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching session
  }

  if (!rescheduleRequest) {
    return <div>No reschedule request found.</div>; // Show message if no reschedule request is found
  }

  return (
    <div>
      <h1 className={title()}>Accept Reschedule Request</h1>
      <div className="items-center p-6">
        <Card className="w-full max-w-9xl rounded-2xl shadow-lg p-6 bg-white">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Original Game Date</h2>
            <p>{rescheduleRequest.originalDate.toLocaleString()}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Proposed Dates</h2>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={selectedDate ? selectedDate.toISOString() : ""}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            >
              <option value="" disabled>Select a date</option>
              {rescheduleRequest.proposedDates.map((date) => (
                <option key={date.toISOString()} value={date.toISOString()}>
                  {date.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Accept
            </button>
            <button
              onClick={handleDeny}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Deny
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}