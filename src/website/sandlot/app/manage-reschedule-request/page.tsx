// app/manage-reschedule-request/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

import { title } from "@/components/primitives";

import { Card, Spinner } from "@heroui/react";

import CustomModal from "./CustomModal";
import "./ManageRescheduleRequest.css";

import getRR from "../functions/getRR";
import acceptRR from "../functions/acceptRR";
import getAllTimeslots from "../functions/getAllTimeslots";

interface RescheduleRequest {
  id: string;
  game_id: number;
  originalDate: Date;
  originalField: string;
  proposedDates: Date[];
  proposedFields: string[];
  reciever_name: string;
  requester_name: string;
  reciever_id: number;
  requester_id: number;
}

interface Timeslot {
  id: number;
  start: string;
  end: string;
  field_id: number;
}

export default function ManageRescheduleRequest() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userTeamId, setUserTeamId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [rescheduleRequests, setRescheduleRequests] = useState<RescheduleRequest[]>([]);
  const [selectedDates, setSelectedDates] = useState<{
    [key: string]: string | null;
  }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{
    id: string;
    action: string;
    originalDate: Date;
    originalField: string;
    reciever_name?: string;
    requester_name?: string;
    newDate?: string;
  } | null>(null);
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const router = useRouter();

  // Combined fetch for session and reschedule requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const session = await getSession();
        const timeslots = await getAllTimeslots();
        if (timeslots) {
          setTimeslots(timeslots);
        }

        if (session) {
          setUserRole(session.user?.role || null);
          setUserTeamId(session.user?.team_id || null);

          // Fetch reschedule requests immediately after session
          const formattedRequests = await getRR({ team_id: session?.user.team_id });
          setRescheduleRequests(formattedRequests);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAccept = (id: string) => {
    const selectedDate = selectedDates[id];
    const request = rescheduleRequests.find((req) => req.id === id);

    if (selectedDate && request) {
      setModalContent({
        id,
        action: "accept",
        originalDate: request.originalDate,
        originalField: request.originalField,
        reciever_name: request.reciever_name,
        requester_name: request.requester_name,
        newDate: selectedDate,
      });
      setModalVisible(true);
    } else {
      alert("Please select a date.");
    }
  };

  const handleDeny = (id: string) => {
    const request = rescheduleRequests.find((req) => req.id === id);

    if (request) {
      setModalContent({
        id,
        action: "deny",
        originalDate: request.originalDate,
        originalField: request.originalField,
        reciever_name: request.reciever_name,
        requester_name: request.requester_name,
      });
      setModalVisible(true);
    }
  };

  const confirmAction = () => {
    if (modalContent) {
      if (modalContent.action === "accept" && modalContent.newDate) {
        // Implement the logic to accept the reschedule request
        const request = rescheduleRequests.find(
          (req) => req.id === modalContent.id,
        );

        if (request) {
          let splitNewDate = parseNewDate(modalContent.newDate);
          let timeslot = deriveTimeslot(splitNewDate[0], splitNewDate[1], timeslots);
          let formattedDate: string = splitNewDate[0].toISOString().split('T')[0]; // Format date as YYYY-MM-DD

          acceptRR({
            rr_id: parseInt(request.id, 10),
            old_game_id: request.game_id,
            home_team_id: request.reciever_id,
            away_team_id: request.requester_id,
            date: formattedDate,
            time: timeslot,
            field: splitNewDate[1],
          });
          alert(
            `Reschedule request ${modalContent.id} accepted for ${modalContent.newDate.toLocaleString()}`,
          );
        }
      } else if (modalContent.action === "deny") {
        // Implement the logic to deny the reschedule request
        alert(`Reschedule request ${modalContent.id} denied.`);
      }
      setModalVisible(false);
      setModalContent(null);
      window.location.reload();
    }
  };

  function parseNewDate(newDate: string): [Date, string] {
    let splitNewDate = newDate.split(" ");

    return [new Date(splitNewDate[0]), splitNewDate[1]];
  }

  function deriveTimeslot(date: Date, field: string, timeslots: Timeslot[]): string {
    // Extract the hour from the input date
    const hour = date.getUTCHours();
  
    // Filter timeslots for the given field and sort them by start time
    const fieldTimeslots = timeslots
      .filter((ts) => ts.field_id.toString() === field)
      .sort((a, b) => {
        const [startHourA, startMinuteA] = a.start.split("-").map(Number);
        const [startHourB, startMinuteB] = b.start.split("-").map(Number);
        return startHourA - startHourB || startMinuteA - startMinuteB; // Sort by hour, then by minute
      });
  
    // Find the matching timeslot where the start time matches the hour
    const matchingTimeslotIndex = fieldTimeslots.findIndex((ts) => {
      const [startHour] = ts.start.split("-").map(Number); // Extract the hour from the timeslot start (HH-MM)
      return startHour === hour;
    });
  
    // Return the sequential ID (1-based index) if a match is found, otherwise return "0"
    return matchingTimeslotIndex !== -1 ? (matchingTimeslotIndex + 1).toString() : "0";
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Spinner label="Loading Reschedule Requests..." size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className={title()}>Manage Reschedule Requests</h1>
      <div className="text-left p-6">
        {rescheduleRequests.length === 0 ? (
          <div>No reschedule requests found.</div>
        ) : (
          rescheduleRequests.map((request) => (
            <Card
              key={request.id}
              className="w-full max-w-9xl rounded-2xl shadow-lg p-6 bg-white dark:bg-gray-800 mb-6"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  Game Requested for Rescheduling
                </h2>
                <p>
                  {request.reciever_name} vs. {request.requester_name}
                </p>
              </div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Original Game Date</h2>
                <p>
                  {request.originalDate.toLocaleString() +
                    " on Field " +
                    request.originalField}
                </p>
              </div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Proposed Dates</h2>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={selectedDates[request.id] || ""}
                  onChange={(e) =>
                    setSelectedDates({
                      ...selectedDates,
                      [request.id]: e.target.value,
                    })
                  }
                >
                  <option disabled value="">
                    Select a date
                  </option>
                  {request.proposedDates.map((date, i) => (
                    <option
                      key={date.toISOString() + request.proposedFields[i]}
                      value={
                        date.toISOString() + " " + request.proposedFields[i]
                      }
                    >
                      {date.toLocaleString() +
                        " on Field " +
                        request.proposedFields[i]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-4">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                  onClick={() => handleAccept(request.id)}
                >
                  Accept
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  onClick={() => handleDeny(request.id)}
                >
                  Deny
                </button>
              </div>
            </Card>
          ))
        )}
        <div className="mt-6">
          <p className="italic">Need to reschedule your team's game?</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-2"
            onClick={() => router.push("/schedule")}
          >
            Reschedule Game
          </button>
        </div>
      </div>

      <CustomModal
        body={
          <>
            <p>
              Are you sure you want to {modalContent?.action} the reschedule
              request?
            </p>
            <p>
              Original Game: {modalContent?.reciever_name} vs.{" "}
              {modalContent?.requester_name}
            </p>
            <p>
              Original Date: {modalContent?.originalDate.toLocaleString()} on
              Field {modalContent?.originalField}
            </p>
            {modalContent?.action === "accept" && modalContent?.newDate && (
              <p>
                New Date:{" "}
                {parseNewDate(modalContent.newDate)[0].toLocaleString() +
                  " on Field " +
                  parseNewDate(modalContent.newDate)[1]}
              </p>
            )}
          </>
        }
        isVisible={modalVisible}
        title={`Confirm ${modalContent?.action === "accept" ? "Acceptance" : "Denial"}`}
        onClose={() => setModalVisible(false)}
        onConfirm={confirmAction}
      />
    </div>
  );
}
