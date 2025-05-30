"use client";

import { useState, useEffect, use } from "react";
import { title } from "@/components/primitives";
import {
    Button,
    Card,
    CardHeader,
    Input,
    Switch,
    Textarea,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
    TableColumn,
} from "@heroui/react";

// Import necessary backend functions (to be implemented)
import getDirectoryTeams from "@/app/functions/getDirectoryTeams";
// import { saveWaiverConfig, getWaiverConfig, signWaiver, getSignedWaivers } from "@/app/functions/waiverFunctions";
import getWaiverFormatByYear from "@/app/functions/getWaiverFormatByYear";
import deleteWaiverFormatByYear from "@/app/functions/deleteWaiverFormat";
import createWaiverFormat from "@/app/functions/createWaiverFormat";
import getWaiverEnabled from "@/app/functions/getWaiverEnabled";
import updateWaiverEnabled from "@/app/functions/updateWaiverEnabled";
import { BlobOptions } from "buffer";

import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";



// Typescript interfaces for type safety
interface WaiverSection {
  id: string;
  text: string;
  requireInitials: boolean;
}

// interface WaiverConfig {
//   id?: string;
//   isEnabled: boolean;
//   title: string;
//   description: string;
//   sections: WaiverSection[];
//   requiredSignatures: string[];
// }

interface SignedWaiver {
  id?: string;
  playerId: number;
  playerName: string;
  teamName: string;
  signedAt: Date;
  sections: Record<string, string>;
  signatures: Record<string, string>;
}

interface Team {
  team_id: number;
  name: string;
  division: string;
}

interface WaiverFormat {
  id?: string;
  year: string;
  index: number;
  text: string;
}

export default function WaiverManagementPage() {

  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  // State for waiver configuration
  const [waiverConfig, setWaiverConfig] = useState<boolean>()
  const [tempWaiverConfig, setTempWaiverConfig] = useState<boolean>();

  // State for signed waivers and teams
  const [signedWaivers, setSignedWaivers] = useState<SignedWaiver[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("All Teams");

  // State for editing sections
  const [editingSection, setEditingSection] = useState<WaiverFormat | null>(null);

  // State for form inputs for signing waiver
  const [playerName, setPlayerName] = useState("");
  const [playerTeam, setPlayerTeam] = useState("");

  const [waiverFormat, setWaiverFormat] = useState<WaiverFormat[] | null>(null)
  const [tempSection, setTempSection] = useState<WaiverFormat | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // const [selectedYear, setSelectedYear] = useState<string>("")

  // Fetch teams and existing waiver config on component mount
  useEffect(() => {
    const fetchInitialData = async () => {

      const session = await getSession();
      setSession(session);

      if (!session || session?.user.role !== "commissioner") {
        router.push("/");
        return;
      } else {

        try {
          // Fetch teams
          // const teamList = await getDirectoryTeams();
          // const teamNames: string[] = teamList.map((team: Team) => team.name);
          // setTeams(teamNames);

          // Fetch existing waiver configuration
          const enabled = await getWaiverEnabled();
          setWaiverConfig(enabled.waiver_enabled);
          setTempWaiverConfig(enabled.waiver_enabled);

          // Fetch signed waivers
          // const existingWaivers = await getSignedWaivers();
          // setSignedWaivers(existingWaivers);

        } catch (error) {
          console.error("Failed to fetch initial data", error);
        }
      }
    };
    
    fetchInitialData();
    fetchWaiverFormat();
    setIsLoading(false);
  }, []);

  // useEffect(() => {
  //   const updateWaiverStatus = async () => {
  //     if (!isLoading) {
  //       try {
  //         await updateWaiverEnabled({ waiver_enabled: waiverConfig });
  //       } catch (error) {
  //         console.error("Failed to update waiver status", error);
  //       }
  //     }
  //   };

  //   updateWaiverStatus();
  // }
  // , [waiverConfig]);

  const fetchWaiverFormat = async () => {
    try {
        const currentYear = String(new Date().getFullYear());
        let data = await getWaiverFormatByYear({ year: currentYear });

        // Process each section's text with decodeURIComponent and replace newlines
        let processedData = data.map((section: WaiverFormat) => ({
            ...section,
            text: decodeURIComponent(section.text)
        }));

        processedData = processedData.sort((s1: any, s2:any) => s1.index > s2.index);
        setWaiverFormat(processedData);

        if (processedData.length === 0) {
            let newWaiverFormat = [
                {
                    id: "0",
                    year: currentYear,
                    index: 0,
                    text: "",
                },
            ];
            setWaiverFormat(newWaiverFormat);
        }
    } catch (error) {
        console.error("Failed to fetch waiver format.", error);
    }
};

  // Function to save waiver configuration
  const handleSaveConfiguration = async () => {
    try {

      setWaiverConfig(tempWaiverConfig);
      await updateWaiverEnabled({ waiver_enabled: tempWaiverConfig });

      if(waiverFormat) {
        let waiverCopy = [...waiverFormat]
        for(let i = 0; i < waiverFormat.length; i++) {
          waiverCopy[i].text = encodeURI(waiverCopy[i].text)
          delete waiverCopy[0].id
        }
        await deleteWaiverFormatByYear({ year: String(new Date().getFullYear()) })
        setTimeout(async() => {
          await createWaiverFormat({data: waiverCopy})
          alert("Waiver configuration saved successfully!");
        }, 1000)
      }
    } catch (error) {
      console.error("Failed to save configuration", error);
      alert("Failed to save waiver configuration");
    }
  };

  // Function to add a new waiver section
  const addWaiverSection = () => {
    if(waiverFormat) {
      const newSection: WaiverFormat = {
        id: `section-${Date.now()}`,
        year: waiverFormat[0].year,
        index: waiverFormat[waiverFormat.length - 1].index + 1,
        text: "New waiver requirement",
      };
      setTempSection(newSection);
      setEditingSection(newSection);
    };
  }

  // Function to update a waiver section
  const updateWaiverSection = (updatedSection: WaiverFormat) => {
    if (tempSection?.id === updatedSection.id) {
      // This is a new section being saved
      if(waiverFormat) {
        let waiverCopy = [...waiverFormat]
        waiverCopy?.push(updatedSection)
        setWaiverFormat(waiverCopy);
        setTempSection(null);
      }
    } else {
      // This is an existing section being updated
      if(waiverFormat) {
        for (let i = 0; i < waiverFormat.length; i++) {
          if(waiverFormat[i].id == updatedSection.id) {
            let sections = [...waiverFormat]
            sections[i] = updatedSection
            setWaiverFormat(sections)
          }
        }
      }
    }
    setEditingSection(null);
  };

  // Function to delete a waiver section
  const deleteWaiverSection = (sectionId: string) => {
    if(waiverFormat) {
      for (let i = 0; i < waiverFormat.length; i++) {
        if(waiverFormat[i].id == sectionId) {
          let sections = [...waiverFormat]
          sections.splice(i,1)
          setWaiverFormat(sections)
        }
      }
    }
  };

  // Function to download signed waiver
  const downloadSignedWaiver = (waiver: SignedWaiver) => {
    const waiverJson = JSON.stringify(waiver, null, 2);
    const blob = new Blob([waiverJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `waiver_${waiver.playerId}_${new Date().toISOString()}.json`;
    link.click();
  };

  // Update the modal close handler
  const handleCloseModal = () => {
    setEditingSection(null);
    setTempSection(null);
  };

   if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full min-h-[400px]">
          <Spinner label="Loading Waiver Editor..." size="lg" />
        </div>
      );
    }

  return (
    <div>
      <div className="pageHeader">
        <h1 className={title()}>Waiver Management</h1>
      </div>

      {/* Waiver Configuration Section */}
      <Card className="mt-6 mb-6">
        <CardHeader>
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-xl font-semibold">Waiver Configuration</h2>
          </div>
        </CardHeader>
        <div className="p-4">
          <div className="justify-left flex items-center space-x-4 mb-4">
            <span>Enable Waiver</span>
            <Switch 
              isSelected={tempWaiverConfig}
              // onChange={(e) => setWaiverConfig(e.target.checked)}
              onValueChange={setTempWaiverConfig}
            />
          </div>

          {/* <div className="space-y-4">
            <Input 
              placeholder="Waiver Title"
              value={waiverFormat ? decodeURI(waiverFormat[0].text): "Title"}
              onChange={(e) => {
                if(waiverFormat) {
                  let section = [...waiverFormat]
                  section[0].text = e.target.value
                  setWaiverFormat(section)
                }
              }}
            />
            <Textarea 
              placeholder="Waiver Description"
              value={waiverConfig.description}
              onChange={(e) => setWaiverConfig(prev => ({...prev, description: e.target.value}))}
            />
          </div> */}

          {/* Waiver Sections Management */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Waiver Sections</h3>
            {waiverFormat?.map((section, index, array) => (
                <div key={section.id}>
                  {/* Conditionally render "Footer" above the last section */}
                  {index === array.length - 1 && (
                    <p className="text-sm font-semibold mb-2 text-left">Footer</p>
                  )}
                  {index === 0 && (
                    <p className="text-sm font-semibold mb-2 text-left">Title</p>
                  )}

                  <div className="flex items-start justify-between p-3 border rounded mb-2">
                    <div className="flex-1 mr-4 overflow-hidden">
                      <p className="whitespace-pre-wrap break-words text-black dark:text-white">
                        {section.text}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button onPress={() => setEditingSection(section)}>Edit</Button>
                      <Button onPress={() => deleteWaiverSection(section.id ? section.id : "1")}>Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
            <Button onPress={addWaiverSection} className="mt-4 w-40">Add Section</Button>
          </div>
          <div className="mt-4">
            <Button onPress={handleSaveConfiguration}>Save Configuration</Button>
          </div>
        </div>
      </Card>

      {/* Signed Waivers Section */}
      {/* <Card className="mt-6 mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Signed Waivers</h2>
        </CardHeader>
        <div className="p-4">
            <Table>
                <TableHeader>
                    <TableColumn>Player ID</TableColumn>
                    <TableColumn>Player Name</TableColumn>
                    <TableColumn>Team</TableColumn>
                    <TableColumn>Signed Date</TableColumn>
                    <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody>
                    {signedWaivers.map((waiver) => (
                    <TableRow key={waiver.id}>
                        <TableCell>{waiver.playerId}</TableCell>
                        <TableCell>{waiver.playerName}</TableCell>
                        <TableCell>{waiver.teamName}</TableCell>
                        <TableCell>{new Date(waiver.signedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                        <Button onPress={() => downloadSignedWaiver(waiver)}>
                            Download
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </Card> */}

      {/* Edit Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-[900px]">
            <h2 className="text-xl font-semibold mb-4">Edit Waiver Section</h2>
            <div className="space-y-4">
              <Textarea 
                value={editingSection.text}
                onChange={(e) => setEditingSection(prev => prev ? {...prev, text: e.target.value} : null)}
                placeholder="Section Text"
                className="w-full whitespace-pre-wrap break-words"
                rows={4}
              />
              {/* <div className="flex items-center space-x-2">
                <Switch 
                  checked={editingSection.requireInitials}
                  onChange={(e) => setEditingSection(prev => 
                    prev ? {...prev, requireInitials: e.target.checked} : null
                  )}
                />
                <span>Require Initials</span>
              </div> */}
              <div className="flex justify-end space-x-2">
              <Button onPress={handleCloseModal}>
                Cancel
              </Button>
              <Button onPress={() => editingSection && updateWaiverSection(editingSection)}>
                Save
              </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}