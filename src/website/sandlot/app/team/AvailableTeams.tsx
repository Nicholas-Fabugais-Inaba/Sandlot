import React, { useEffect, useState } from "react";
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
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
          <Table aria-label="Available Teams" classNames={{ table: "min-w-full" }}>
            <TableHeader>
              <TableColumn className="req-table-col">Team Name</TableColumn>
              <TableColumn className="req-table-col">Division</TableColumn>
              <TableColumn className="req-table-col">Action</TableColumn>
            </TableHeader>
            <TableBody>
              {teams
                .filter((team) => team.id !== userTeamId)
                .map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="team-name">{team.name}</TableCell>
                  <TableCell className="division-name">{team.division}</TableCell>
                  <TableCell>
                    <Button
                      className="button small-button"
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
        ) : loading ? (
          <p>Loading teams...</p>
        ) : (
          <p>No available teams at the moment.</p>
        )}
      </div>

      <div className="w-2/5">
        <h2 className="text-xl font-semibold text-center mb-4 mt-4">
          Pending Requests
        </h2>
        {pendingRequests.length > 0 ? (
          <Table aria-label="Pending Requests" classNames={{ table: "min-w-full" }}>
            <TableHeader>
              <TableColumn className="req-table-col">Team Name</TableColumn>
              <TableColumn className="req-table-col">Status</TableColumn>
            </TableHeader>
            <TableBody>
              {pendingRequests.map((request, index) => (
                <TableRow key={index}>
                  <TableCell className="team-name">{request.team_name}</TableCell>
                  <TableCell className="status">
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
        ) : loading ? (
          <p>Loading requests...</p>
        ) : (
          <p>No pending requests at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default AvailableTeams;