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
import getSolsticeSettings from "../functions/getSolsticeSettings";
import getAllOccupiedGameslots from "../functions/getAllOccupiedGameslots";
import denyRR from "../functions/denyRR";

interface RescheduleRequest {
  id: string;
  game_id: number;
  originalDate: Date;
  originalField: string;
  proposedDates: Date[];
  proposedFields: string[];
  proposedTimeslots: string[];
  receiver_name: string;
  requester_name: string;
  receiver_id: number;
  requester_id: number;
}

interface Timeslot {
  id: number;
  start: string;
  end: string;
  field_id: number;
  field_name: string;
}

export default function ManageRescheduleRequest() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userTeamId, setUserTeamId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [rescheduleRequests, setRescheduleRequests] = useState<RescheduleRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<RescheduleRequest[]>([]);
  const [selectedDates, setSelectedDates] = useState<{
    [key: string]: string | null;
  }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{
    id: string;
    action: string;
    originalDate: Date;
    originalField: string;
    receiver_name?: string;
    requester_name?: string;
    newDate?: string;
  } | null>(null);
  // const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const solsticeTimeslots = [
    { id: 1, start: "21-0", end: "22-30", field_id: 1, field_name: "Field 1" },
    { id: 2, start: "22-30", end: "24-0", field_id: 1, field_name: "Field 1" },
    { id: 3, start: "21-0", end: "22-30", field_id: 2, field_name: "Field 2" },
    { id: 4, start: "22-30", end: "24-0", field_id: 2, field_name: "Field 2" },
    { id: 5, start: "21-0", end: "22-30", field_id: 3, field_name: "Field 3" },
    { id: 6, start: "22-30", end: "24-0", field_id: 3, field_name: "Field 3" },
    { id: 7, start: "24-0", end: "25-30", field_id: 3, field_name: "Field 3" },
    { id: 8, start: "25-30", end: "27-0", field_id: 3, field_name: "Field 3" },
  ];
  const router = useRouter();

  // Combined fetch for session and reschedule requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const session = await getSession();
        const solsticeSettings = await getSolsticeSettings();
        const timeslotsResponse = solsticeSettings.active ? solsticeTimeslots : await getAllTimeslots();
        // if (timeslotsResponse) {
        //   setTimeslots(timeslotsResponse);
        // }

        if (session) {
          setUserRole(session.user?.role || null);
          setUserTeamId(session.user?.team_id || null);

          // Fetch reschedule requests immediately after session
          const [formattedRequests, formattedPendingRequests] = await getRR({ team_id: session?.user.team_id }, timeslotsResponse, solsticeSettings);
          setRescheduleRequests(formattedRequests);
          setPendingRequests(formattedPendingRequests);
          console.log("Reschedule Requests:", formattedRequests);
          console.log("Pending Requests:", formattedPendingRequests);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function isConflict(newDate: string, occupiedGameslots: Record<string, boolean>): boolean {
    console.log(newDate);
    // Split the newDate into components
    const [dateTime, time, field] = newDate.split(" ");

    // Adjust the date by subtracting 8 hours
    const adjustedDate = subtractHours(new Date(dateTime), 8).toISOString();

    // Extract only the date portion (before the "T" in ISO format)
    const date = adjustedDate.split("T")[0];
  
    // Reconstruct the normalized key
    const normalizedKey = `${date} ${time} ${field}`;
  
    // Check if the normalized key exists in the occupiedGameslots
    return !!occupiedGameslots[normalizedKey];
  }

  const handleAccept = async (id: string) => {
    const selectedDate = selectedDates[id];
    const request = rescheduleRequests.find((req) => req.id === id);

    if (selectedDate && request) {
      try {
        // Fetch occupied gameslots
        const occupiedGameslots = await getAllOccupiedGameslots();

        // Check for conflicts
        if (isConflict(selectedDate, occupiedGameslots)) {
          alert("The selected date and time conflict with another game. Please choose a different time.");
          return;
        }

        // No conflict, proceed to set modal content
        setModalContent({
          id,
          action: "accept",
          originalDate: request.originalDate,
          originalField: request.originalField,
          receiver_name: request.receiver_name,
          requester_name: request.requester_name,
          newDate: selectedDate,
        });
        setModalVisible(true);
      } catch (error) {
        console.error("Error checking for conflicts:", error);
        alert("An error occurred while checking for conflicts. Please try again.");
      }
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
        receiver_name: request.receiver_name,
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
          // Get the selected date and field for the new game
          let splitNewDate = parseNewDate(modalContent.newDate);
          // Choose necessary timeslots based on solstice dates
          // let timeslot = "0";
          // if (dynamicSolstice) {
          //   if (splitNewDate[0] >= solsticeStart && splitNewDate[0] <= solsticeEnd) {
          //     timeslot = deriveTimeslot(splitNewDate[0], splitNewDate[1], solsticeTimeslots);
          //   } else {
          //     timeslot = deriveTimeslot(splitNewDate[0], splitNewDate[1], nonSolsticeTimeslots);
          //   }
          // }
          // // Get the timeslot for the new game
          // timeslot = deriveTimeslot(splitNewDate[0], splitNewDate[1], timeslots);
          let ajustedDate = subtractHours(splitNewDate[0], 8); // Adjust the date by subtracting 1 hour
          let formattedDate: string = ajustedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

          acceptRR({
            rr_id: parseInt(request.id, 10),
            old_game_id: request.game_id,
            home_team_id: request.receiver_id,
            away_team_id: request.requester_id,
            date: formattedDate,
            time: splitNewDate[1],
            field: splitNewDate[2],
          });
          alert(
            `Reschedule request ${modalContent.id} accepted for ${ajustedDate.toISOString()} on Field ${splitNewDate[2]}`,
          );
        }
      } else if (modalContent.action === "deny") {
        // Implement the logic to deny the reschedule request
        try {
          denyRR({ rr_id: parseInt(modalContent.id, 10) }); // Call denyRR with the request ID
          alert(`Reschedule request ${modalContent.id} denied.`);
        } catch (error) {
          console.error("Error denying the reschedule request:", error);
          alert("An error occurred while denying the reschedule request. Please try again.");
        }
      }
      setModalVisible(false);
      setModalContent(null);
      window.location.reload();
    }
  };

  function subtractHours(date: Date, hours: number): Date {
    const adjustedDate = new Date(date);
    adjustedDate.setUTCHours(adjustedDate.getUTCHours() - hours);
    return adjustedDate;
  }

  function parseNewDate(newDate: string): [Date, string, string] {
    let splitNewDate = newDate.split(" ");

    return [new Date(splitNewDate[0]), splitNewDate[1], splitNewDate[2]];
  }

  // function deriveTimeslot(date: Date, field: string, timeslots: Timeslot[]): string {
  //   // Extract the hour from the input date
  //   const hour = date.getUTCHours();
  
  //   // Filter timeslots for the given field and sort them by start time
  //   const fieldTimeslots = timeslots
  //     .filter((ts) => ts.field_id.toString() === field)
  //     .sort((a, b) => {
  //       const [startHourA, startMinuteA] = a.start.split("-").map(Number);
  //       const [startHourB, startMinuteB] = b.start.split("-").map(Number);
  //       return startHourA - startHourB || startMinuteA - startMinuteB; // Sort by hour, then by minute
  //     });
  
  //   // Find the matching timeslot where the start time matches the hour
  //   const matchingTimeslotIndex = fieldTimeslots.findIndex((ts) => {
  //     const [startHour] = ts.start.split("-").map(Number); // Extract the hour from the timeslot start (HH-MM)
  //     return startHour === hour;
  //   });
  
  //   // Return the sequential ID (1-based index) if a match is found, otherwise return "0"
  //   return matchingTimeslotIndex !== -1 ? (matchingTimeslotIndex + 1).toString() : "0";
  // }

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-full min-h-[400px]">
  //       <Spinner label="Loading Reschedule Requests..." size="lg" />
  //     </div>
  //   );
  // }

  return (
    <div>
      <h1 className={`${title()}`}>Manage Reschedule Requests</h1>
      <div className="flex flex-wrap justify-between mt-8">
      {/* Incoming Reschedule Requests Section */}
      <div className="w-full lg:w-[48%]">
        <h2 className="text-2xl font-semibold mb-4">Incoming Reschedule Requests</h2>
        {rescheduleRequests.length === 0 ? (
          <div>No reschedule requests found.</div>
        ) : (
          rescheduleRequests
            .filter((request) => request.receiver_id === userTeamId) // Filter for incoming requests
            .map((request) => (
              <Card
                key={request.id}
                className="w-full rounded-2xl shadow-lg p-6 bg-white dark:bg-gray-800 mb-6 text-left"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">
                    Game Requested for Rescheduling
                  </h2>
                  <p>
                    {request.receiver_name} vs. {request.requester_name}
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
                          date.toISOString() +
                          " " +
                          request.proposedTimeslots[i] +
                          " " +
                          request.proposedFields[i]
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

      {/* Pending Reschedule Requests Section */}
      <div className="w-full lg:w-[48%]">
        <h2 className="text-2xl font-semibold mb-4">Pending Reschedule Requests</h2>
        {pendingRequests.filter((request) => request.requester_id === userTeamId).length === 0 ? (
          <div>No pending reschedule requests found.</div>
        ) : (
          pendingRequests
            .filter((request) => request.requester_id === userTeamId) // Filter for pending requests
            .map((request) => (
              <Card
                key={request.id}
                className="w-full rounded-2xl shadow-lg p-6 bg-white dark:bg-gray-800 mb-6 text-left"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">
                    Pending Reschedule Request
                  </h2>
                  <p>
                    {request.receiver_name} vs. {request.requester_name}
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
                  <ul className="list-disc pl-6">
                    {request.proposedDates.map((date, i) => (
                      <li key={date.toISOString() + request.proposedFields[i]}>
                        {date.toLocaleString() +
                          " on Field " +
                          request.proposedFields[i]}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))
        )}
      </div>

      <CustomModal
        body={
          <>
            <p>
              Are you sure you want to {modalContent?.action} the reschedule
              request?
            </p>
            <p>
              Original Game: {modalContent?.receiver_name} vs.{" "}
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
                  parseNewDate(modalContent.newDate)[2]}
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
    </div>
  );
}
