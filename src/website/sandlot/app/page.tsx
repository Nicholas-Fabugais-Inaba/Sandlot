// app/page.tsx

"use client";

import React, { useState } from "react";
import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { Card } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import "./HomePage.css";  // Import the new CSS file

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [isWeatherDropdownOpen, setWeatherDropdownOpen] = useState(false);

  const handleWeatherClick = () => {
    setWeatherDropdownOpen(!isWeatherDropdownOpen);
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
      default:
        return (
          <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="inline-block max-w-xl text-center justify-center">
              <span className={title()}>Welcome to the&nbsp;</span>
              <br />
              <span className={title()}>McMaster GSA</span>
              <br />
              <span className={title()}>Softball League</span>
              <div className={subtitle({ class: "mt-4" })}>
                Beautiful, fast and modern React UI library.
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                isExternal
                className={buttonStyles({
                  color: "primary",
                  radius: "full",
                  variant: "shadow",
                })}
                href={siteConfig.links.docs}
              >
                Documentation
              </Link>
              <Link
                isExternal
                className={buttonStyles({ variant: "bordered", radius: "full" })}
                href={siteConfig.links.github}
              >
                <GithubIcon size={20} />
                GitHub
              </Link>
            </div>

            <div className="mt-8">
              <Snippet hideCopyButton hideSymbol variant="bordered">
                <span>
                  Get started by editing <Code color="primary">app/page.tsx</Code>
                </span>
              </Snippet>
            </div>

            {/* Announcements Section */}
            <section className="mt-8">
              <h2 className="text-xl font-bold">Announcements</h2>
              <ul className="list-disc list-inside mt-4">
                <li>Season starts on April 1st!</li>
                <li>Registration opens on March 1st.</li>
                <li>New teams welcome to join.</li>
              </ul>
            </section>
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
                    <li>Rainouts</li>
                    <li>Ainsley Wood Station</li>
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
