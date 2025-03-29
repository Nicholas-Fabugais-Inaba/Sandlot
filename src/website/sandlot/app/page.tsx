// app/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Button, Card } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { getSession, signIn } from "next-auth/react";

import "./HomePage.css";

// announcement function imports
import getAnnouncements from "./functions/getAnnouncements";
import createAnnouncement from "./functions/createAnnouncement";
import updateAnnouncement from "./functions/updateAnnouncement";
import deleteAnnouncement from "./functions/deleteAnnouncement";

// New imports for directory management
// import getDirectoryItems from "./functions/getDirectoryItems";
// import createDirectoryItem from "./functions/createDirectoryItem";
// import updateDirectoryItem from "./functions/updateDirectoryItem";
// import deleteDirectoryItem from "./functions/deleteDirectoryItem";

import { GithubIcon } from "@/components/icons";
import { title, subtitle } from "@/components/primitives";
import { siteConfig } from "@/config/site";

interface Announcement {
  id: number;
  date: string;
  title: string;
  body: string;
}

interface DirectoryItem {
  id: number;
  title: string;
  link?: string;
  body: string; 
  onClick?: () => void;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [isWeatherDropdownOpen, setWeatherDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const router = useRouter();
  
  // Announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
  const [newAnnouncementBody, setNewAnnouncementBody] = useState("");
  const [editingAnnouncementIndex, setEditingAnnouncementIndex] = useState<number | null>(null);
  const [editAnnouncementTitle, setEditAnnouncementTitle] = useState("");
  const [editAnnouncementBody, setEditAnnouncementBody] = useState("");

  // Directory state
  // const [directoryItems, setDirectoryItems] = useState<DirectoryItem[]>([]);
  // const [editingDirectoryIndex, setEditingDirectoryIndex] = useState<number | null>(null);
  // const [editDirectoryTitle, setEditDirectoryTitle] = useState("");
  // const [editDirectoryBody, setEditDirectoryBody] = useState("");
  // const [editDirectoryLink, setEditDirectoryLink] = useState("");

  // Page title state
  const [pageTitle, setPageTitle] = useState("Welcome to the McMaster GSA Softball League");
  const [editingPageTitle, setEditingPageTitle] = useState(false);
  const [editedPageTitle, setEditedPageTitle] = useState("");

  // Unsaved changes state
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [unsavedSection, setUnsavedSection] = useState<string | null>(null);

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      const session = await getSession();
      setSession(session);

      const fetchedAnnouncements = await getAnnouncements();
      setAnnouncements(fetchedAnnouncements);

      // Fetch directory items
      // const fetchedDirectoryItems = await getDirectoryItems();
      // setDirectoryItems(fetchedDirectoryItems);

      setLoading(false);
    };

    fetchInitialData();
  }, []);

  // Unsaved changes handler
  const handleSetActiveSection = (newSection: string) => {
    if (unsavedChanges) {
      const confirmSwitch = window.confirm(
        "You have unsaved changes. Are you sure you want to switch sections?"
      );
      
      if (confirmSwitch) {
        setActiveSection(newSection);
        setUnsavedChanges(false);
        setUnsavedSection(null);
      }
    } else {
      setActiveSection(newSection);
    }
  };

  // Page Title Editing
  const handleEditPageTitle = () => {
    if (session?.user.role === "commissioner") {
      setEditingPageTitle(true);
      setEditedPageTitle(pageTitle);
      setUnsavedChanges(true);
      setUnsavedSection("title");
    }
  };

  const handleSavePageTitle = () => {
    if (editedPageTitle.trim()) {
      setPageTitle(editedPageTitle);
      setEditingPageTitle(false);
      setUnsavedChanges(false);
      setUnsavedSection(null);
    }
  };

  // Directory Item Editing
  // const handleEditDirectoryItem = (index: number) => {
  //   if (session?.user.role === "commissioner") {
  //     setEditingDirectoryIndex(index);
  //     setEditDirectoryTitle(directoryItems[index].title);
  //     setEditDirectoryLink(directoryItems[index].link || "");
  //     setEditDirectoryBody(directoryItems[index].body || "");
  //     setUnsavedChanges(true);
  //     setUnsavedSection("directory");
  //   }
  // };

  // const handleSaveDirectoryItem = async (index: number) => {
  //   if (editDirectoryTitle.trim()) {
  //     const updatedItems = [...directoryItems];
  //     updatedItems[index] = {
  //       ...updatedItems[index],
  //       title: editDirectoryTitle,
  //       link: editDirectoryLink,
  //       body: editDirectoryBody,
  //     };

  //     // Call update function
  //     await updateDirectoryItem(updatedItems[index]);

  //     setDirectoryItems(updatedItems);
  //     setEditingDirectoryIndex(null);
  //     setUnsavedChanges(false);
  //     setUnsavedSection(null);
  //   }
  // };

  // const handleAddDirectoryItem = async () => {
  //   if (session?.user.role === "commissioner") {
  //     const newItem = {
  //       id: directoryItems.length > 0 ? 
  //         Math.max(...directoryItems.map(item => item.id)) + 1 : 
  //         1,
  //       title: "New Directory Item",
  //       link: ""
  //       body: ""
  //     };

  //     // Call create function
  //     const createdItem = await createDirectoryItem(newItem);

  //     setDirectoryItems([...directoryItems, createdItem]);
  //   }
  // };

  // const handleDeleteDirectoryItem = async (index: number) => {
  //   if (session?.user.role === "commissioner") {
  //     const itemToDelete = directoryItems[index];
      
  //     // Call delete function
  //     await deleteDirectoryItem(itemToDelete.id);

  //     const updatedItems = directoryItems.filter((_, i) => i !== index);
  //     setDirectoryItems(updatedItems);
  //   }
  // };

  const handleAddAnnouncement = async () => {
    if (newAnnouncementTitle.trim() && newAnnouncementBody.trim()) {
      const newAnnouncement = {
        id: announcements.length > 0 ? announcements[announcements.length - 1].id + 1 : 1, // Increment the ID based on existing IDs to match the assigned ID in the database
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
    setEditingAnnouncementIndex(index);
    setEditAnnouncementTitle(announcements[index].title);
    setEditAnnouncementBody(announcements[index].body);
  };

  const handleSaveAnnouncementEdit = async (index: number) => {
    if (editAnnouncementTitle.trim() && editAnnouncementBody.trim()) {
      const updatedAnnouncements = [...announcements];

      // Keep the original date and id and update only title and body
      updatedAnnouncements[index] = {
        id: announcements[index].id,
        title: editAnnouncementTitle,
        body: editAnnouncementBody,
        date: announcements[index].date,
      };
      await updateAnnouncement(updatedAnnouncements[index]);
      setAnnouncements(updatedAnnouncements);

      setEditingAnnouncementIndex(null); // Reset editing index
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

  const handleResourcesClick = () => {
    setResourcesDropdownOpen(!isResourcesDropdownOpen);
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
            <Card className="rounded-2xl shadow-lg p-6 bg-white dark:bg-gray-800">
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
            <Card className="rounded-2xl shadow-lg p-6 bg-white dark:bg-gray-800">
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
            <Card className="rounded-2xl shadow-lg p-6 bg-white dark:bg-gray-800">
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
              <div className="w-full mx-auto">
                <div className="flex flex-col gap-6">
                  {/* Announcements Section - Now full width and taking up sign in/register space */}
                  <div
                    className="w-full max-h-[600px] overflow-y-auto border border-gray-300 rounded-lg p-4"
                    id="announcements"
                  >
                    <section className="w-full">
                      <h2 className="text-xl font-bold">Announcements</h2>
  
                      {session?.user.role === "commissioner" && (
                        <div className="flex flex-col gap-2 mt-4">
                          <input
                            className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            placeholder="Enter announcement title..."
                            type="text"
                            value={newAnnouncementTitle}
                            onChange={(e) => setNewAnnouncementTitle(e.target.value)}
                          />
                          <textarea
                            className="border border-gray-300 rounded-md px-3 py-2 w-full h-24"
                            placeholder="Enter announcement body..."
                            value={newAnnouncementBody}
                            onChange={(e) => setNewAnnouncementBody(e.target.value)}
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
                        {announcements.length === 0 ? (
                          <li className="text-center text-gray-500">No announcements</li>
                        ) : (
                          announcements.map((announcement, index) => {
                            return (
                              <li
                                key={index}
                                className="flex flex-col bg-gray-100 p-3 rounded-lg shadow-sm"
                              >
                                <div className="relative w-full">
                                  {/* Date in the top right corner */}
                                  <div className="absolute top-2 right-2 text-xs text-gray-500">
                                    {announcement.date}
                                  </div>
  
                                  {editingAnnouncementIndex === index ? (
                                    <>
                                      <input
                                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                                        type="text"
                                        value={editAnnouncementTitle}
                                        onChange={(e) => setEditAnnouncementTitle(e.target.value)}
                                      />
                                      <textarea
                                        className="border border-gray-300 rounded-md px-2 py-1 w-full h-24 mt-2"
                                        value={editAnnouncementBody}
                                        onChange={(e) => setEditAnnouncementBody(e.target.value)}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <h3 className="text-lg font-bold text-gray-800">
                                        {announcement.title}
                                      </h3>
                                      <p className="text-gray-800 break-words whitespace-pre-wrap">
                                        {announcement.body}
                                      </p>
                                    </>
                                  )}
  
                                  {/* Buttons for Edit and Delete */}
                                  {session?.user.role === "commissioner" && (
                                    <div className="flex space-x-2 mt-2">
                                      {editingAnnouncementIndex === index ? (
                                        <button
                                          className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600"
                                          onClick={() => handleSaveAnnouncementEdit(index)}
                                        >
                                          Save
                                        </button>
                                      ) : (
                                        <button
                                          className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600"
                                          onClick={() => handleEditAnnouncement(index)}
                                        >
                                          Edit
                                        </button>
                                      )}
                                      <button
                                        className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                                        onClick={() => handleDeleteAnnouncement(index)}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </li>
                            );
                          })
                        )}
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Directory</h2>
            {session?.user.role === "commissioner" && (
              <button 
                className="text-green-500 hover:text-green-700"
                // onClick={handleAddDirectoryItem}
              >
                + Add
              </button>
            )}
          </div>
          <div className="space-y-4 overflow-auto">
            {/* {directoryItems.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between">
                {editingDirectoryIndex === index ? (
                  <div className="flex space-x-2 w-full">
                    <input 
                      className="flex-grow border rounded px-2 py-1"
                      value={editDirectoryTitle}
                      onChange={(e) => setEditDirectoryTitle(e.target.value)}
                    />
                    <input 
                      className="border rounded px-2 py-1"
                      placeholder="Link (optional)"
                      value={editDirectoryLink}
                      onChange={(e) => setEditDirectoryLink(e.target.value)}
                    />
                    <textarea 
                      className="border rounded px-2 py-1"
                      placeholder="Body content"
                      value={editDirectoryBody}
                      onChange={(e) => setEditDirectoryBody(e.target.value)}
                      rows={4}
                    />
                    <button 
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleSaveDirectoryItem(index)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center w-full justify-between">
                    <button
                      className={`directory-item text-left font-semibold inline-block ${activeSection === item.title.toLowerCase().replace(/\s+/g, '') ? "text-primary font-semibold border-b-2 border-primary" : ""}`}
                      onClick={() => handleSetActiveSection(item.title.toLowerCase().replace(/\s+/g, ''))}
                    >
                      {item.title}
                    </button>
                    {session?.user.role === "commissioner" && (
                      <div className="flex space-x-2">
                        <button 
                          className="text-yellow-500 hover:text-yellow-700"
                          onClick={() => handleEditDirectoryItem(index)}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteDirectoryItem(index)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))} */}
          </div>
        </Card>
      </aside>
      <main className="flex-grow flex flex-col overflow-hidden">
        {/* Sticky Title Header - Added word-break and white-space properties */}
        <div className="sticky top-0 bg-white z-10 p-4 border-b">
          <div className="w-full mx-auto">
            {editingPageTitle ? (
              <div className="flex flex-col space-y-2">
                <textarea 
                  className="text-2xl border rounded px-2 py-1 w-full resize-y min-h-[50px] max-h-[200px]"
                  value={editedPageTitle}
                  onChange={(e) => setEditedPageTitle(e.target.value)}
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button 
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={handleSavePageTitle}
                  >
                    Save
                  </button>
                  <button 
                    className="bg-gray-300 text-gray-700 px-2 py-1 rounded"
                    onClick={() => {
                      setEditingPageTitle(false);
                      setUnsavedChanges(false);
                      setUnsavedSection(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="inline-block relative w-full">
                <span 
                  className={`${title()} break-words whitespace-normal`}
                >
                  {pageTitle}
                  {session?.user.role === "commissioner" && (
                    <button 
                      className="ml-2 text-blue-500 hover:text-blue-700"
                      onClick={handleEditPageTitle}
                    >
                      Edit
                    </button>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <section className="flex-grow overflow-auto p-6">
          <div className="w-full mx-auto">
            <div className="flex flex-row gap-6">
              <div className="flex-grow">
                {renderContent()}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );  
}
