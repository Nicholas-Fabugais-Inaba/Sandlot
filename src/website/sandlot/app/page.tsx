// app/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Button, Card } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { getSession, signIn } from "next-auth/react";

import "./HomePage.css"; // Import the new CSS file

// announcement function imports
import getAnnouncements from "./functions/getAnnouncements";
import createAnnouncement from "./functions/createAnnouncement";
import updateAnnouncement from "./functions/updateAnnouncement";
import deleteAnnouncement from "./functions/deleteAnnouncement";

import { GithubIcon } from "@/components/icons";
import { title, subtitle } from "@/components/primitives";
import { siteConfig } from "@/config/site";

interface Announcement {
  id: number;
  date: string;
  title: string;
  body: string;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [isWeatherDropdownOpen, setWeatherDropdownOpen] = useState(false);
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
  const [newAnnouncementBody, setNewAnnouncementBody] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();

      setSession(session);
      const announcements = await getAnnouncements();

      setAnnouncements(announcements);

      setLoading(false);
    };

    fetchSession();
  }, []);

  const handleAddAnnouncement = async () => {
    if (newAnnouncementTitle.trim() && newAnnouncementBody.trim()) {
      const newAnnouncement = {
        id: announcements[announcements.length - 1].id + 1, // Increment the ID based on existing IDs to match the assigned ID in the database
        date: new Date().toLocaleDateString(), // Set the current date for new announcements
        title: newAnnouncementTitle,
        body: newAnnouncementBody,
      };

      await createAnnouncement(newAnnouncement);
      setAnnouncements([...announcements, newAnnouncement]);

      setNewAnnouncementTitle(""); // Reset title field
      setNewAnnouncementBody(""); // Reset body field
    }
  };

  const handleEditAnnouncement = (index: number) => {
    setEditingIndex(index);
    setEditTitle(announcements[index].title);
    setEditBody(announcements[index].body);
  };

  const handleSaveEdit = async (index: number) => {
    if (editTitle.trim() && editBody.trim()) {
      const updatedAnnouncements = [...announcements];

      // Keep the original date and id and update only title and body
      updatedAnnouncements[index] = {
        id: announcements[index].id,
        title: editTitle,
        body: editBody,
        date: announcements[index].date,
      };
      await updateAnnouncement(updatedAnnouncements[index]);
      setAnnouncements(updatedAnnouncements);

      setEditingIndex(null); // Reset editing index
    } else {
      // Optionally, show an error message if the title or body is empty
      alert("Both title and body must be filled out.");
    }
  };

  const handleDeleteAnnouncement = async (index: number) => {
    const updatedAnnouncements = announcements.filter((_, i) => i !== index);

    await deleteAnnouncement({ announcement_id: announcements[index].id });
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
                Parking has changed their approach to the situation this year,
                so please pass along this important set of instructions to your
                players to avoid being ticketed:
              </p>
              <ol className="list-disc list-inside mb-4 space-y-2">
                <li>
                  Scan QR codes posted around the lot, or Text 4916 to 75498;
                  Tap link to register.
                </li>
                <li>Enter license plate.</li>
                <li>Select Rate (evening flat rate).</li>
                <li>
                  Enter promo <b>GSABB24</b> before payment.
                </li>
                <li>Promo Code will reduce price to $0.</li>
                <li>Click park for free to register plate.</li>
                <li>
                  <a
                    className="text-blue-600"
                    href="https://www.gsasoftball.ca/PrintDocs/Mc%20Master-18x24-4916.pdf"
                    rel="noreferrer"
                    target="_blank"
                  >
                    HONK Parking QR code
                  </a>
                </li>
              </ol>
              <p className="mb-4">
                This process does NOT need to be repeated in lot Q and will also
                grant you access to that lot if you want to stop by the Phoenix.
              </p>
              <p className="mb-4">
                If you have any questions, let me know at{" "}
                <a
                  className="text-blue-600"
                  href="mailto:j.a.nease@outlook.com"
                >
                  j.a.nease@outlook.com
                </a>
                . Please make sure you are prepared for this or you are at risk
                of being ticketed, which you will have to take up with the
                parking office on your own time.
              </p>
            </Card>
          </div>
        );
      case "dates":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Key Season Dates</h2>
            <Card className="rounded-2xl shadow-lg p-6 bg-white">
              <p className="mb-4">
                Dates and Tournaments (Null dates indicate event will not
                happen)
              </p>
              <p className="mb-4">
                <a
                  className="text-blue-600"
                  href="https://www.gsasoftball.ca/Phoenix%20Cup/Phoenix%20Cup.htm"
                  rel="noreferrer"
                  target="_blank"
                >
                  Phoenix Cup:
                </a>{" "}
                2025-08-20 to 2025-08-24
              </p>
              <p className="mb-4">
                Significant Dates: Year 2025 (provisional and may change)
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>2025-03-15 - Team entry period starts</li>
                <li>2025-04-07 - (12:00 noon) Deadline for Team entries</li>
                <li>
                  2025-04-07 - (6:00 p.m. to 7:30 p.m.) Captain's meeting, BSB
                  154 (Burke Science Building close by the Phoenix)
                </li>
                <li>2025-04-23 - (approximate) official schedule released</li>
                <li>
                  2025-04-28 - Tentative opening day of schedule for Mixed
                  League
                </li>
                <li>TBA - Annual Psychology tournament</li>
                <li>
                  2024-06-15 - Tentative Date for Women's Tournament (Saturday)
                </li>
                <li>
                  2025-08-18 (5:00 p.m.) - Phoenix Cup organizational meeting
                </li>
                <li>2025-08-29 - Last day of regular schedule</li>
                <li>2025-08-20 to 2025-08-24 - Phoenix Cup Tournament</li>
                <li>
                  2025-08-24 to 2025-08-29 - Fields available as regular season
                  and for re-scheduled games
                </li>
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
                Our current policy is to follow the lead of City of Hamilton
                Recreation and close fields when the city closes theirs. This
                may change as we will have equipment designed to deal with at
                least some of the issues that close city fields (i.e. standing
                water on infields). The rescheduling of rainouts will be handled
                by the online procedures for re-scheduling games that is
                described elsewhere. The most up to date master schedule will
                always be found on the website (MKL Softball Web Site). The
                Phoenix also posts up to date schedules once a week on their
                bulletin board.
              </p>
              <p className="mb-4">
                I leave the negotiations as to an appropriate replay date to the
                two captains. Use the online request form to determine what
                slots are open. If no one has requested the time before you, you
                will be re-assigned to that date and it will be marked as taken
                on the schedule. In the case of duplicate requests, it will be
                first come, first served. The procedure has been automated for
                your convenience and mine and should not require my
                intervention. The online procedure automatically notifies both
                team captains, the commissioner, and the umpiring coordinators
                by email.
              </p>
              <p className="mb-4">Andy Duncan (x26893)</p>
              <p className="mb-4">Curt Heckamen</p>
            </Card>
          </div>
        );
      default:
        return (
          <section className="w-full px-6 py-8 md:py-10">
            {/* Scrollable container */}
            <div className="w-full mx-auto">
              <div className="flex flex-row gap-6 min-w-[900px]">
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
                      <Button
                        className="button"
                        onPress={() =>
                          signIn(undefined, { callbackUrl: "/profile" })
                        }
                      >
                        Sign In
                      </Button>
                      <p className="mt-2 mb-2">
                        <em>Don't have an account?</em>
                      </p>
                      <Button
                        className="button"
                        onPress={() => router.push("/profile/register")}
                      >
                        Register
                      </Button>
                    </div>
                  )}
                </div>

                {/* Announcements Section */}
                <div
                  className="max-h-96 overflow-y-auto border border-gray-300 rounded-lg p-4"
                  id="announcements"
                >
                  <section className="flex-1 min-w-[500px]">
                    <h2 className="text-xl font-bold">Announcements</h2>

                    {session?.user.role === "commissioner" && (
                      <div className="flex flex-col gap-2 mt-4">
                        <input
                          className="border border-gray-300 rounded-md px-3 py-2 w-full"
                          placeholder="Enter announcement title..."
                          type="text"
                          value={newAnnouncementTitle}
                          onChange={(e) =>
                            setNewAnnouncementTitle(e.target.value)
                          }
                        />
                        <textarea
                          className="border border-gray-300 rounded-md px-3 py-2 w-full h-24"
                          placeholder="Enter announcement body..."
                          value={newAnnouncementBody}
                          onChange={(e) =>
                            setNewAnnouncementBody(e.target.value)
                          }
                        />
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                          onClick={handleAddAnnouncement}
                        >
                          Post
                        </button>
                      </div>
                    )}

                    {/* Announcements List */}
                    <ul className="mt-4 space-y-2">
                      {announcements.map((announcement, index) => {
                        const currentDate = new Date().toLocaleDateString(); // Format the current date

                        return (
                          <li
                            key={index}
                            className="flex flex-col bg-gray-100 p-3 rounded-lg shadow-sm"
                          >
                            <div className="relative w-full">
                              {/* Date in the top right corner */}
                              <div className="absolute top-2 right-2 text-xs text-gray-500">
                                {currentDate}
                              </div>

                              {editingIndex === index ? (
                                <>
                                  <input
                                    className="border border-gray-300 rounded-md px-2 py-1 w-full"
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) =>
                                      setEditTitle(e.target.value)
                                    }
                                  />
                                  <textarea
                                    className="border border-gray-300 rounded-md px-2 py-1 w-full h-24 mt-2"
                                    value={editBody}
                                    onChange={(e) =>
                                      setEditBody(e.target.value)
                                    }
                                  />
                                </>
                              ) : (
                                <>
                                  <h3 className="text-lg font-bold text-gray-800">
                                    {announcement.title}
                                  </h3>
                                  <p className="text-gray-800">
                                    {announcement.body}
                                  </p>
                                </>
                              )}

                              {/* Buttons for Edit and Delete */}
                              {session?.user.role === "commissioner" && (
                                <div className="flex space-x-2 mt-2">
                                  {editingIndex === index ? (
                                    <button
                                      className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600"
                                      onClick={() => handleSaveEdit(index)}
                                    >
                                      Save
                                    </button>
                                  ) : (
                                    <button
                                      className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600"
                                      onClick={() =>
                                        handleEditAnnouncement(index)
                                      }
                                    >
                                      Edit
                                    </button>
                                  )}
                                  <button
                                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                                    onClick={() =>
                                      handleDeleteAnnouncement(index)
                                    }
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                </div>
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
              className="directory-item text-left font-semibold w-full"
              onClick={() => setActiveSection("home")}
            >
              Announcements
            </button>
            <button
              className="directory-item text-left font-semibold w-full"
              onClick={() => setActiveSection("parking")}
            >
              Parking Information
            </button>
            <button
              className="directory-item text-left font-semibold w-full"
              onClick={() => setActiveSection("dates")}
            >
              Key Season Dates
            </button>
            <button
              className="directory-item text-left font-semibold w-full"
              onClick={() => router.push("/team/directory")}
            >
              Team Directory
            </button>
            <div className="relative">
              <button
                className="directory-item text-left font-semibold w-full"
                onClick={handleWeatherClick}
              >
                Weather Information
              </button>
              {isWeatherDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 p-2 bg-white shadow rounded-md z-10">
                  <ul className="list-disc list-inside mb-4 space-y-2">
                    <li>
                      <button
                        className="text-left text-blue-600"
                        onClick={handleRainoutsClick}
                      >
                        Rainouts
                      </button>
                    </li>
                    <li>
                      <a
                        className="text-blue-600"
                        href="https://tempestwx.com/station/48603/"
                        rel="noreferrer"
                        target="_blank"
                      >
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
