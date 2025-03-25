import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner
} from "@heroui/react";
import { getSession } from "next-auth/react";
import createJR from "../functions/createJR";
import getTeams from "../functions/getTeams";
import getPendingRequests from "../functions/getJRByPlayer";

interface Team {
  id: number;
  name: string;
  division: string;
}

interface JoinRequest {
  id: number;
  team_name: string;
  accepted: boolean | null;
}

const AvailableTeams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [pendingRequests, setPendingRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [userTeamId, setUserTeamId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTeamsAndRequests = async () => {
      const teams = await getTeams();
      setTeams(teams);

      const session = await getSession();
      if (session) {
        setUserTeamId(session.user.team_id);
        const requests = await getPendingRequests(session.user.email);
        setPendingRequests(requests);
      }

      setLoading(false);
    };

    fetchTeamsAndRequests();
  }, []);

  const handleRequestJoin = async (team_id: number) => {
    const session = await getSession();
    if (session) {
      setActionLoading(true);
      await createJR({
        email: session.user.email,
        team_id: team_id
      });
      const requests = await getPendingRequests(session.user.email);
      setPendingRequests(requests);
      setActionLoading(false);
    }
  };

  return (
    <div className="flex">
      <div className="w-3/5 mr-4">
        <h2 className="text-xl font-semibold text-center mb-4 mt-4">
          Request to join a team from the list below:
        </h2>
        {teams.length > 0 && userTeamId !== null ? (
          <div className="max-h-80 overflow-y-auto p-2">
            <Table aria-label="Available Teams" classNames={{ table: "min-w-full" }}>
              <TableHeader>
                {[
                  "Team Name",
                  "Division",
                  "Action",
                ].map((key) => (
                  <TableColumn key={key} allowsSorting>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </TableColumn>
                ))}
              </TableHeader>
              <TableBody>
                {teams
                  .filter((team) => team.id !== userTeamId)
                  .map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="text-medium text-left mb-2">{team.name}</TableCell>
                    <TableCell className="text-medium text-left mb-2">{team.division}</TableCell>
                    <TableCell className="w-[200px]">
                      <Button
                        className="w-36 h-12 text-sm rounded-full bg-blue-500 text-white dark:bg-blue-600 dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-blue-700 transition"
                        disabled={actionLoading}
                        onPress={() => handleRequestJoin(team.id)}
                      >
                        Request to Join
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Spinner label="Loading Teams..." size="lg" />
          </div>
        ) : (
          <p>No available teams at the moment.</p>
        )}
      </div>

      <div className="w-2/5">
        <h2 className="text-xl font-semibold text-center mb-4 mt-4">
          Pending Requests
        </h2>
        {pendingRequests.length > 0 ? (
          <div className="max-h-80 overflow-y-auto p-2">
            <Table aria-label="Pending Requests" classNames={{ table: "min-w-full" }}>
              <TableHeader>
                <TableColumn>Team Name</TableColumn>
                <TableColumn>Status</TableColumn>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((request, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-medium text-left mb-2">{request.team_name}</TableCell>
                    <TableCell className="text-medium text-left mb-2">
                      {request.accepted === true
                        ? "Accepted"
                        : request.accepted === false
                        ? "Denied"
                        : "Pending"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Spinner label="Loading Requests..." size="lg" />
          </div>
        ) : (
          <p>No pending requests at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default AvailableTeams;