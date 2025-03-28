"use client";

import { useState, useEffect } from "react";
import { title } from "@/components/primitives";
import {
    Button,
    Card,
    CardHeader,
    Input,
    Switch,
    Textarea,
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

// Typescript interfaces for type safety
interface WaiverSection {
  id: string;
  text: string;
  requireInitials: boolean;
}

interface WaiverConfig {
  id?: string;
  isEnabled: boolean;
  title: string;
  description: string;
  sections: WaiverSection[];
  requiredSignatures: string[];
}

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

export default function WaiverManagementPage() {
  // State for waiver configuration
  const [waiverConfig, setWaiverConfig] = useState<WaiverConfig>({
    isEnabled: false,
    title: "GSA Softball Player Waiver",
    description: "Player participation waiver for the summer softball league.",
    sections: [
      {
        id: 'risk-acknowledgement',
        text: "The risk of injury from the activities involved in this program is significant, including the potential for permanent paralysis and death.",
        requireInitials: true
      }
    ],
    requiredSignatures: ['Full Name', 'Parent/Guardian (if under 18)']
  });

  // State for signed waivers and teams
  const [signedWaivers, setSignedWaivers] = useState<SignedWaiver[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("All Teams");

  // State for editing sections
  const [editingSection, setEditingSection] = useState<WaiverSection | null>(null);

  // State for form inputs for signing waiver
  const [playerName, setPlayerName] = useState("");
  const [playerTeam, setPlayerTeam] = useState("");

  // Fetch teams and existing waiver config on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch teams
        const teamList = await getDirectoryTeams();
        const teamNames: string[] = teamList.map((team: Team) => team.name);
        setTeams(teamNames);

        // Fetch existing waiver configuration
        // const existingConfig = await getWaiverConfig();
        // if (existingConfig) {
        //   setWaiverConfig(existingConfig);
        // }

        // Fetch signed waivers
        // const existingWaivers = await getSignedWaivers();
        // setSignedWaivers(existingWaivers);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      }
    };

    fetchInitialData();
  }, []);

  // Function to save waiver configuration
  const handleSaveConfiguration = async () => {
    try {
    //   const savedConfig = await saveWaiverConfig(waiverConfig);
      alert("Waiver configuration saved successfully!");
    } catch (error) {
      console.error("Failed to save configuration", error);
      alert("Failed to save waiver configuration");
    }
  };

  // Function to add a new waiver section
  const addWaiverSection = () => {
    const newSection: WaiverSection = {
      id: `section-${Date.now()}`,
      text: "New waiver requirement",
      requireInitials: true
    };
    setWaiverConfig(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setEditingSection(newSection);
  };

  // Function to update a waiver section
  const updateWaiverSection = (updatedSection: WaiverSection) => {
    setWaiverConfig(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === updatedSection.id ? updatedSection : section
      )
    }));
    setEditingSection(null);
  };

  // Function to delete a waiver section
  const deleteWaiverSection = (sectionId: string) => {
    setWaiverConfig(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  // Function to sign waiver
  const handleSignWaiver = async () => {
    // Validate inputs
    if (!playerName || !playerTeam) {
      alert("Please fill in all fields");
      return;
    }

    try {
      // Prepare waiver signing data
      const waiverData: Omit<SignedWaiver, 'id' | 'signedAt'> = {
        playerId: Math.floor(Math.random() * 10000), // Generate mock player ID
        playerName,
        teamName: playerTeam,
        sections: {
          'risk-acknowledgement': playerName.slice(0, 2) // Mock initials
        },
        signatures: {
          'Full Name': playerName
        }
      };

      // Call backend function to sign waiver
    //   const signedWaiver = await signWaiver(waiverData);
      
      // Update local state
    //   setSignedWaivers(prev => [...prev, signedWaiver]);
      
      // Reset form
      setPlayerName("");
      setPlayerTeam("");
      
      alert("Waiver signed successfully!");
    } catch (error) {
      console.error("Failed to sign waiver", error);
      alert("Failed to sign waiver");
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

  return (
    <div>
      <h1 className={title()}>Waiver Management</h1>

      {/* Waiver Configuration Section */}
      <Card className="mt-6 mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Waiver Configuration</h2>
            <Button onClick={handleSaveConfiguration}>Save Configuration</Button>
          </div>
        </CardHeader>
        <div className="p-4">
          <div className="flex items-center space-x-4 mb-4">
            <span>Enable Waiver:</span>
            <Switch 
              checked={waiverConfig.isEnabled}
              onChange={(e) => setWaiverConfig(prev => ({...prev, isEnabled: e.target.checked}))}
            />
          </div>

          <div className="space-y-4">
            <Input 
              placeholder="Waiver Title"
              value={waiverConfig.title}
              onChange={(e) => setWaiverConfig(prev => ({...prev, title: e.target.value}))}
            />
            <Textarea 
              placeholder="Waiver Description"
              value={waiverConfig.description}
              onChange={(e) => setWaiverConfig(prev => ({...prev, description: e.target.value}))}
            />
          </div>

          {/* Waiver Sections Management */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Waiver Sections</h3>
            {waiverConfig.sections.map((section) => (
              <div key={section.id} className="flex items-center justify-between p-3 border rounded mb-2">
                <div>
                  <p>{section.text}</p>
                  <span className="text-sm text-gray-500">
                    {section.requireInitials ? 'Requires Initials' : 'No Initials Required'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setEditingSection(section)}>Edit</Button>
                  <Button onClick={() => deleteWaiverSection(section.id)}>Delete</Button>
                </div>
              </div>
            ))}
            <Button onClick={addWaiverSection} className="mt-4">Add Section</Button>
          </div>
        </div>
      </Card>

      {/* Signed Waivers Section */}
      <Card className="mt-6 mb-6">
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
                        <Button onClick={() => downloadSignedWaiver(waiver)}>
                            Download
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </Card>

      {/* Edit Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Waiver Section</h2>
            <div className="space-y-4">
              <Textarea 
                value={editingSection.text}
                onChange={(e) => setEditingSection(prev => prev ? {...prev, text: e.target.value} : null)}
                placeholder="Section Text"
              />
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={editingSection.requireInitials}
                  onChange={(e) => setEditingSection(prev => 
                    prev ? {...prev, requireInitials: e.target.checked} : null
                  )}
                />
                <span>Require Initials</span>
              </div>
              <div className="flex justify-end space-x-2">
                <Button onClick={() => setEditingSection(null)}>
                  Cancel
                </Button>
                <Button onClick={() => editingSection && updateWaiverSection(editingSection)}>
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
