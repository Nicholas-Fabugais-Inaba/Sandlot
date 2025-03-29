// app/broadcast/page.tsx

"use client";

import { title } from "@/components/primitives";

import { useState, useEffect } from "react";
import getDirectoryTeams from "@/app/functions/getDirectoryTeams";
// import sendEmail from "../functions/sendEmail";

interface Player {
  player_id: number;
  first_name: string;
  last_name: string;
  email: string;
  captain: boolean;
  active: boolean;
}

// Define an interface for the team object
interface Team {
  team_id: number;
  name: string;
  division: string;
  players: Player[];
}

export default function EmailBroadcastPage() {
  const [emailTitle, setEmailTitle] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [recipientType, setRecipientType] = useState<'allTeams' | 'specificTeams' | 'captains' | 'specificPlayers' | 'activePlayers' | 'inactivePlayers'>('allTeams');
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [selectedCaptains, setSelectedCaptains] = useState<number[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamList = await getDirectoryTeams();
        setTeams(teamList); // Store the full team objects
      } catch (error) {
        console.error("Error fetching teams:", error);
        alert("Failed to load teams. Please try again.");
      }
    };
  
    fetchTeams();
  }, []);

  return (
    <div>
      <h1 className={title()}>Email Broadcasting</h1>
      <form className="items-center p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Select Recipients</h3>
          
          {/* Recipient Type Selection */}
          <select
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
            value={recipientType}
            onChange={(e) => {
              setRecipientType(e.target.value as any);
              // Reset selections when changing type
              setSelectedTeams([]);
              setSelectedPlayers([]);
              setSelectedCaptains([]);
            }}
          >
            <option value="allTeams">All Teams</option>
            <option value="specificTeams">Specific Teams</option>
            <option value="captains">Team Captains</option>
            <option value="specificPlayers">Specific Players</option>
            <option value="activePlayers">All Active Players</option>
            <option value="inactivePlayers">All Inactive Players</option>
          </select>

          {/* Team Selection */}
          {recipientType === 'specificTeams' && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Hold Ctrl/Cmd to select multiple teams</p>
              <div className="max-h-60 overflow-y-auto border rounded-lg dark:border-gray-600">
                {teams.map((team) => (
                  <div 
                    key={team.team_id}
                    className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <input
                      type="checkbox"
                      id={`team-${team.team_id}`}
                      checked={selectedTeams.includes(team.name)}
                      onChange={(e) => {
                        setSelectedTeams(prev =>
                          e.target.checked
                            ? [...prev, team.name]
                            : prev.filter(name => name !== team.name)
                        );
                      }}
                      className="mr-2"
                    />
                    <label htmlFor={`team-${team.team_id}`} className="flex-1">
                      {team.name} - {team.division}
                    </label>
                  </div>
                ))}
              </div>
              {selectedTeams.length > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Selected: {selectedTeams.length} team{selectedTeams.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}

          {/* Captains Selection */}
          {/* {recipientType === 'captains' && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Select team captains</p>
              <div className="max-h-60 overflow-y-auto border rounded-lg dark:border-gray-600">
                {teams.map((team) => (
                  <div key={team.team_id} className="p-2 border-b dark:border-gray-600 last:border-b-0">
                    <h4 className="font-semibold mb-2">{team.name}</h4>
                    {team.players
                      .filter(player => player.captain)
                      .map((captain) => (
                        <div 
                          key={captain.player_id}
                          className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <input
                            type="checkbox"
                            id={`captain-${captain.player_id}`}
                            checked={selectedCaptains.includes(captain.player_id)}
                            onChange={(e) => {
                              setSelectedCaptains(prev =>
                                e.target.checked
                                  ? [...prev, captain.player_id]
                                  : prev.filter(id => id !== captain.player_id)
                              );
                            }}
                            className="mr-2"
                          />
                          <label htmlFor={`captain-${captain.player_id}`}>
                            {captain.first_name} {captain.last_name}
                          </label>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
              {selectedCaptains.length > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Selected: {selectedCaptains.length} captain{selectedCaptains.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )} */}
          {/* Player Selection */}
          {/* {recipientType === 'specificPlayers' && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Select players</p>
              <div className="max-h-60 overflow-y-auto border rounded-lg dark:border-gray-600">
                {teams.map((team) => (
                  <div key={team.team_id} className="p-2 border-b dark:border-gray-600 last:border-b-0">
                    <h4 className="font-semibold mb-2">{team.name}</h4>
                    <div className="space-y-1">
                      {team.players.map((player) => (
                        <div 
                          key={player.player_id}
                          className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <input
                            type="checkbox"
                            id={`player-${player.player_id}`}
                            checked={selectedPlayers.includes(player.player_id)}
                            onChange={(e) => {
                              setSelectedPlayers(prev =>
                                e.target.checked
                                  ? [...prev, player.player_id]
                                  : prev.filter(id => id !== player.player_id)
                              );
                            }}
                            className="mr-2"
                          />
                          <label htmlFor={`player-${player.player_id}`}>
                            {player.first_name} {player.last_name}
                            {player.captain && <span className="ml-2 text-sm text-blue-500">(Captain)</span>}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {selectedPlayers.length > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Selected: {selectedPlayers.length} player{selectedPlayers.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )} */}
        </div>

        <button
          type="button"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          // onClick={handleSendEmail}
        >
          Send Email
        </button>
      </form>
    </div>
  );
}
