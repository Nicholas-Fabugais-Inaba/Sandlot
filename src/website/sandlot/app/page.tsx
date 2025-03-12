// app/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { Button, Card } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth'; 
import { getSession, signIn } from 'next-auth/react';
import "./HomePage.css";  // Import the new CSS file

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [isWeatherDropdownOpen, setWeatherDropdownOpen] = useState(false);
  const router = useRouter();
  const [announcements, setAnnouncements] = useState([
    "Season starts on April 1st!",
    "Registration opens on March 1st.",
    "New teams welcome to join."
  ]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");  
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();
  }, []);
  
  const handlePostAnnouncement = () => {
    if (newAnnouncement.trim()) {
      setAnnouncements([...announcements, newAnnouncement]);
      setNewAnnouncement("");
    }
  };  

  const handleAddAnnouncement = () => {
    if (newAnnouncement.trim() !== "") {
      setAnnouncements([...announcements, newAnnouncement]);
      setNewAnnouncement("");
    }
  };
  
  const handleEditAnnouncement = (index: number) => {
    setEditingIndex(index);
    setEditValue(announcements[index]);
  };
  
  const handleSaveEdit = (index: number) => {
    const updatedAnnouncements = [...announcements];
    updatedAnnouncements[index] = editValue;
    setAnnouncements(updatedAnnouncements);
    setEditingIndex(null);
  };
  
  const handleDeleteAnnouncement = (index: number) => {
    const updatedAnnouncements = announcements.filter((_, i) => i !== index);
    setAnnouncements(updatedAnnouncements);
  };  

  const handleWeatherClick = () => {
    setWeatherDropdownOpen(!isWeatherDropdownOpen);
  };

  const handleRainoutsClick = () => {
    setActiveSection("rainouts");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "parking":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Parking Information</h2>
            <Card className="rounded-2xl shadow-lg p-6 bg-white">
              <p className="mb-4">
                Parking has changed their approach to the situation this year, so please pass along this important set of instructions to your players to avoid being ticketed:
              </p>
              <ol className="list-disc list-inside mb-4 space-y-2">
                <li>Scan QR codes posted around the lot, or Text 4916 to 75498; Tap link to register.</li>
                <li>Enter license plate.</li>
                <li>Select Rate (evening flat rate).</li>
                <li>Enter promo <b>GSABB24</b> before payment.</li>
                <li>Promo Code will reduce price to $0.</li>
                <li>Click park for free to register plate.</li>
                <li>
                  <a href="https://www.gsasoftball.ca/PrintDocs/Mc%20Master-18x24-4916.pdf" target="_blank" className="text-blue-600">HONK Parking QR code</a>
                </li>
              </ol>
              <p className="mb-4">
                This process does NOT need to be repeated in lot Q and will also grant you access to that lot if you want to stop by the Phoenix.
              </p>
              <p className="mb-4">
                If you have any questions, let me know at <a href="mailto:j.a.nease@outlook.com" className="text-blue-600">j.a.nease@outlook.com</a>. Please make sure you are prepared for this or you are at risk of being ticketed, which you will have to take up with the parking office on your own time.
              </p>
            </Card>
          </div>
        );
      case "dates":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Key Season Dates</h2>
            <Card className="rounded-2xl shadow-lg p-6 bg-white">
              <p className="mb-4">Dates and Tournaments (Null dates indicate event will not happen)</p>
              <p className="mb-4">
                <a href="https://www.gsasoftball.ca/Phoenix%20Cup/Phoenix%20Cup.htm" target="_blank" className="text-blue-600">Phoenix Cup:</a> 2025-08-20 to 2025-08-24
              </p>
              <p className="mb-4">Significant Dates: Year 2025 (provisional and may change)</p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>2025-03-15 - Team entry period starts</li>
                <li>2025-04-07 - (12:00 noon) Deadline for Team entries</li>
                <li>2025-04-07 - (6:00 p.m. to 7:30 p.m.) Captain's meeting, BSB 154 (Burke Science Building close by the Phoenix)</li>
                <li>2025-04-23 - (approximate) official schedule released</li>
                <li>2025-04-28 - Tentative opening day of schedule for Mixed League</li>
                <li>TBA - Annual Psychology tournament</li>
                <li>2024-06-15 - Tentative Date for Women's Tournament (Saturday)</li>
                <li>2025-08-18 (5:00 p.m.) - Phoenix Cup organizational meeting</li>
                <li>2025-08-29 - Last day of regular schedule</li>
                <li>2025-08-20 to 2025-08-24 - Phoenix Cup Tournament</li>
                <li>2025-08-24 to 2025-08-29 - Fields available as regular season and for re-scheduled games</li>
              </ul>
            </Card>
          </div>
        );  
        case "rainouts":
          return (
            <div>
              <h2 className="text-xl font-bold mb-4">Procedure for Rainouts</h2>
              <Card className="rounded-2xl shadow-lg p-6 bg-white">
                <p className="mb-4">
                  Our current policy is to follow the lead of City of Hamilton Recreation and close fields when the city closes theirs. This may change as we will have equipment designed to deal with at least some of the issues that close city fields (i.e. standing water on infields). The rescheduling of rainouts will be handled by the online procedures for re-scheduling games that is described elsewhere. The most up to date master schedule will always be found on the website (MKL Softball Web Site). The Phoenix also posts up to date schedules once a week on their bulletin board.
                </p>
                <p className="mb-4">
                  I leave the negotiations as to an appropriate replay date to the two captains. Use the online request form to determine what slots are open. If no one has requested the time before you, you will be re-assigned to that date and it will be marked as taken on the schedule. In the case of duplicate requests, it will be first come, first served. The procedure has been automated for your convenience and mine and should not require my intervention. The online procedure automatically notifies both team captains, the commissioner, and the umpiring coordinators by email.
                </p>
                <p className="mb-4">
                  Andy Duncan (x26893)
                </p>
                <p className="mb-4">
                  Curt Heckamen
                </p>
              </Card>
            </div>
          );          
      default:
        return (
          <section className="w-full px-6 py-8 md:py-10">
            {/* Scrollable container */}
            <div className="w-full mx-auto">
              <div className="flex flex-row gap-6 min-w-[800px]">  
                {/* Welcome Section */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 min-w-0">
                  <div className="inline-block max-w-xl">
                    <span className={title()}>Welcome to the&nbsp;</span>
                    <br />
                    <span className={title()}>McMaster GSA</span>
                    <br />
                    <span className={title()}>Softball League</span>
                  </div>
                  {!loading && session === null && (
                    <div className="flex flex-col items-center mt-6 ml-20">
                      <Button onPress={() => signIn(undefined, { callbackUrl: "/profile" })} className="button">
                        Sign In
                      </Button>
                      <p className="mt-2 mb-2"><em>Don't have an account?</em></p>
                      <Button onPress={() => router.push('/profile/register')} className="button">
                        Register
                      </Button>
                    </div>
                  )}
                </div>

                {/* Announcements Section */}
                <section className="flex-1 min-w-[300px]">
                  <h2 className="text-xl font-bold">Announcements</h2>

                  {session?.user.role === "commissioner" && (
                    <div className="flex gap-2 mt-4">
                      <input
                        type="text"
                        value={newAnnouncement}
                        onChange={(e) => setNewAnnouncement(e.target.value)}
                        placeholder="Enter announcement..."
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                      />
                      <button
                        onClick={handleAddAnnouncement}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Post
                      </button>
                    </div>
                  )}

                  {/* Announcements List */}
                  <ul className="mt-4 space-y-2">
                    {announcements.map((announcement, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm"
                      >
                        {editingIndex === index ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 flex-grow"
                          />
                        ) : (
                          <span className="text-gray-800">{announcement}</span>
                        )}

                        {/* Buttons for Edit and Delete */}
                        {session?.user.role === "commissioner" && (
                          <div className="flex space-x-2 ml-2">
                            {editingIndex === index ? (
                              <button
                                onClick={() => handleSaveEdit(index)}
                                className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600"
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEditAnnouncement(index)}
                                className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600"
                              >
                                Edit
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteAnnouncement(index)}
                              className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="flex">
      <aside className="sidebar p-4">
        <Card className="rounded-2xl shadow-lg p-4 h-full">
          <h2 className="text-xl font-bold mb-4">Directory</h2>
          <div className="space-y-4">
            <button
              onClick={() => setActiveSection("home")}
              className="directory-item text-left font-semibold w-full"
            >
              Announcements
            </button>
            <button
              onClick={() => setActiveSection("parking")}
              className="directory-item text-left font-semibold w-full"
            >
              Parking Information
            </button>
            <button
              onClick={() => setActiveSection("dates")}
              className="directory-item text-left font-semibold w-full"
            >
              Key Season Dates
            </button>
            <button
              onClick={() => router.push('/team/directory')}
              className="directory-item text-left font-semibold w-full"
            >
              Team Directory
            </button>
            <div className="relative">
              <button
                onClick={handleWeatherClick}
                className="directory-item text-left font-semibold w-full"
              >
                Weather Information
              </button>
              {isWeatherDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 p-2 bg-white shadow rounded-md z-10">
                  <ul className="list-disc list-inside mb-4 space-y-2">
                    <li><button onClick={handleRainoutsClick} className="text-left text-blue-600">Rainouts</button></li>
                    <li>
                      <a href="https://tempestwx.com/station/48603/" target="_blank" className="text-blue-600">
                        Ainsley Wood Station
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Card>
      </aside>
      <main className="flex-grow p-8 h-full overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}
