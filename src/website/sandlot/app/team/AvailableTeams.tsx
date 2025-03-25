import React, { useEffect, useState } from "react";
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { getSession } from "next-auth/react";
import getTeamsDirectory from "../functions/getTeamsDirectory";
import createJR from "../functions/createJR";

interface Team {
  id: number;
  name: string;
  division: string;
}

const AvailableTeams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      const teams = await getTeamsDirectory();
      setTeams(teams);
      setLoading(false);
    };

    fetchTeams();
  }, []);

  const handleRequestJoin = async (team_id: number) => {
    const session = await getSession();
    if (session) {
      setActionLoading(true);
      await createJR({
        email: session.user.email,
        team_id: team_id
      });
      setActionLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-center mb-4 mt-4">
        Request to join a team from the list below:
      </h2>
      {teams.length > 0 ? (
        <Table aria-label="Available Teams" classNames={{ table: "min-w-full" }}>
          <TableHeader>
            <TableColumn className="req-table-col">Team Name</TableColumn>
            <TableColumn className="req-table-col">Division</TableColumn>
            <TableColumn className="req-table-col">Action</TableColumn>
          </TableHeader>
          <TableBody>
            {teams.map((team, index) => (
              <TableRow key={index}>
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
  );
};

export default AvailableTeams;