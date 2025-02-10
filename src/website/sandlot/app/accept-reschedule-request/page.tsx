// app/accept-reschedule-request/page.tsx

"use client";

import { useState, useEffect } from "react";
import { getSession } from 'next-auth/react';
import { title } from "@/components/primitives";
import { Card } from "@heroui/react";  // Import NextUI Card
import CustomModal from "./CustomModal";  // Import Custom Modal
import "./AcceptRescheduleRequest.css";  // Custom styles

import getRR from "../functions/getRR";

interface RescheduleRequest {
  id: string;
  originalDate: Date;
  proposedDates: Date[];
  proposedFields: string[];
  home: string;
  away: string;
}

export default function AcceptRescheduleRequest() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userTeamId, setUserTeamId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [rescheduleRequests, setRescheduleRequests] = useState<RescheduleRequest[]>([]);
  const [selectedDates, setSelectedDates] = useState<{ [key: string]: string | null }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{ id: string, action: string, originalDate: Date, newDate?: string } | null>(null);

  // Fetch session data to get user role
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        setUserRole(session.user?.role || null);
        setUserTeamId(session.user?.team_id || null);
      }
      setLoading(false); // Set loading to false after fetching session
    };

    fetchSession();
  }, []);

  // Fetch reschedule request data (mocked for this example)
  useEffect(() => {
    (async () => {
          const session = await getSession();
          const formattedRequests = await getRR({ team_id: session?.user.team_id });
          setRescheduleRequests(formattedRequests)
    })();
  }, []);

  const handleAccept = (id: string) => {
    const selectedDate = selectedDates[id];
    const request = rescheduleRequests.find(req => req.id === id);
    if (selectedDate && request) {
      setModalContent({ id, action: 'accept', originalDate: request.originalDate, newDate: selectedDate });
      setModalVisible(true);
    } else {
      alert("Please select a date.");
    }
  };

  const handleDeny = (id: string) => {
    const request = rescheduleRequests.find(req => req.id === id);
    if (request) {
      setModalContent({ id, action: 'deny', originalDate: request.originalDate });
      setModalVisible(true);
    }
  };

  const confirmAction = () => {
    if (modalContent) {
      if (modalContent.action === 'accept' && modalContent.newDate) {
        // Implement the logic to accept the reschedule request
        alert(`Reschedule request ${modalContent.id} accepted for ${modalContent.newDate.toLocaleString()}`);
      } else if (modalContent.action === 'deny') {
        // Implement the logic to deny the reschedule request
        alert(`Reschedule request ${modalContent.id} denied.`);
      }
      setModalVisible(false);
      setModalContent(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching session
  }

  if (rescheduleRequests.length === 0) {
    return <div>No reschedule requests found.</div>; // Show message if no reschedule requests are found
  }

  return (
    <div>
      <h1 className={title()}>Accept Reschedule Requests</h1>
      <div className="items-center p-6">
        {rescheduleRequests.map((request) => (
          <Card key={request.id} className="w-full max-w-9xl rounded-2xl shadow-lg p-6 bg-white mb-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Original Game Date</h2>
              <p>{request.originalDate.toLocaleString()}</p>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Proposed Dates</h2>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={selectedDates[request.id] || ""}
                onChange={(e) => setSelectedDates({ ...selectedDates, [request.id]: e.target.value })}
              >
                <option value="" disabled>Select a date</option>
                {request.proposedDates.map((date, i) => (
                  <option key={date.toISOString() + request.proposedFields[i]} value={date.toLocaleString() + " on field " + request.proposedFields[i]}>
                    {date.toLocaleString() + " on field " + request.proposedFields[i]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleAccept(request.id)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Accept
              </button>
              <button
                onClick={() => handleDeny(request.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Deny
              </button>
            </div>
          </Card>
        ))}
      </div>

      <CustomModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={confirmAction}
        title={`Confirm ${modalContent?.action === 'accept' ? 'Acceptance' : 'Denial'}`}
        body={
          <>
            <p>Are you sure you want to {modalContent?.action} the reschedule request?</p>
            <p>Original Date: {modalContent?.originalDate.toLocaleString()}</p>
            {modalContent?.action === 'accept' && modalContent?.newDate && (
              <p>New Date: {modalContent.newDate.toLocaleString()}</p>
            )}
          </>
        }
      />
    </div>
  );
}