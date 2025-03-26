"use client";

import { title } from "@/components/primitives";

import { useState, useEffect } from "react";
import getDirectoryTeams from "@/app/functions/getDirectoryTeams";
// import sendEmail from "../functions/sendEmail";
import "./EmailBroadcastPage.css";

export default function EmailBroadcastPage() {
  const [emailTitle, setEmailTitle] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("All Teams");
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const teamList = await getDirectoryTeams(); // Fetch teams from DB
      setTeams(teamList);
    };

    fetchTeams();
  }, []);

  const handleRecipientToggle = (email: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleSendEmail = async () => {
    if (!emailTitle || !emailContent || selectedRecipients.length === 0) {
      alert("Please fill in all fields and select at least one recipient.");
      return;
    }

    const emailData = {
      title: emailTitle,
      content: emailContent,
      recipients: selectedRecipients,
    };

    // await sendEmail(emailData);
    // alert("Email sent successfully!");
    // setEmailTitle("");
    // setEmailContent("");
    // setSelectedRecipients([]);
  };

  return (
    <div className="email-broadcast-container">
      <h1 className={title()}>Email Broadcasting</h1>
      <form className="items-center p-6">
        <div className="mb-4">
          <label className="block text-gray-700">Email Title</label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            type="text"
            value={emailTitle}
            onChange={(e) => setEmailTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email Content</label>
          <textarea
            className="w-full px-4 py-2 border rounded-lg"
            rows={5}
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
          />
        </div>
        <div className="mb-4">
            <h3 className="text-lg font-semibold">Select Recipients</h3>
            <select
                className="w-full px-4 py-2 border rounded-lg"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
            >
                <option value="All Teams">All Teams</option>
                {teams.map((team) => (
                <option key={team} value={team}>
                    {team}
                </option>
                ))}
            </select>
        </div>
        <button
          type="button"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg"
          onClick={handleSendEmail}
        >
          Send Email
        </button>
      </form>
    </div>
  );
}
