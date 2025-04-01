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
  const [acceptedRequests, setAcceptedRequests] = useState<JoinRequest[]>([]);
  const [deniedRequests, setDeniedRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [userTeamId, setUserTeamId] = useState<number | null>(null);
  
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: keyof Team;
    direction: "ascending" | "descending";
  } | null>(null);

  useEffect(() => {
    const fetchTeamsAndRequests = async () => {
      const teams = await getTeams();
      setTeams(teams);

      const session = await getSession();
      if (session) {
        setUserTeamId(session.user.team_id);
        const requests = await getPendingRequests(session.user.email);

        const accepted = requests.filter((req: JoinRequest) => req.accepted === true);
        const pending = requests.filter((req: JoinRequest) => req.accepted === null);
        const denied = requests.filter((req: JoinRequest) => req.accepted === false);
        
        setAcceptedRequests(accepted);
        setPendingRequests(pending);
        setDeniedRequests(denied);
      }

      setLoading(false);
    };

    fetchTeamsAndRequests();
  }, []);

  const handleSort = (sortDescriptor: { column: keyof Team; direction: "ascending" | "descending" }) => {
    setSortDescriptor(sortDescriptor);
  };  

  const sortedTeams = [...teams].sort((a, b) => {
    if (!sortDescriptor) return 0;
  
    const { column, direction } = sortDescriptor;
    const first = a[column];
    const second = b[column];
  
    if (typeof first === "string" && typeof second === "string") {
      return direction === "ascending"
        ? first.localeCompare(second)
        : second.localeCompare(first);
    } else if (typeof first === "number" && typeof second === "number") {
      return direction === "ascending" ? first - second : second - first;
    }
  
    return 0;
  });  

  const handleRequestJoin = async (team_id: number, name: string) => {
    // Check if the total number of accepted or pending requests is 3
    if (pendingRequests.length + acceptedRequests.length >= 3) {
      return; // Stop execution if the limit is reached
    }

    const session = await getSession();
    if (session) {
      setActionLoading(true);
      await createJR({
        email: session.user.email,
        team_id: team_id
      });

      let dummyJR = {
        id: 0,
        team_name: name,
        accepted: null
      }
      setPendingRequests([...pendingRequests, dummyJR])

      // After the request is created, fetch the updated pending requests
      setTimeout(async() => {
        const requests = await getPendingRequests(session.user.email);
        const accepted = requests.filter((req: JoinRequest) => req.accepted === true);
        const pending = requests.filter((req: JoinRequest) => req.accepted === null);
        const denied = requests.filter((req: JoinRequest) => req.accepted === false);

        setAcceptedRequests(accepted); // Update accepted requests state
        setPendingRequests(pending); // Update pending requests state
        setDeniedRequests(denied); // Update denied requests state
        setActionLoading(false);
      }, 1000)
    }
  };

  return (
    <div className="flex">
      <div className="w-3/5 mr-4">
        <h2 className="text-xl font-semibold text-center mb-4 mt-4">
          Request to join a team from the list below:
        </h2>
        {sortedTeams.length > 0 && userTeamId !== null ? (
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-2">
            <Table
              aria-label="Available Teams"
              sortDescriptor={sortDescriptor || undefined}
              onSortChange={(sort) => handleSort(sort as { column: keyof Team; direction: "ascending" | "descending" })}
            >
              <TableHeader>
                <>
                  {["name", "division"].map((key) => (
                    <TableColumn key={key} allowsSorting>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </TableColumn>
                  ))}
                  <TableColumn>Action</TableColumn>
                </>
              </TableHeader>
              <TableBody>
                {sortedTeams
                  .filter((team) => team.id !== userTeamId)
                  .map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className="text-medium text-left mb-2">{team.name}</TableCell>
                      <TableCell className="text-medium text-left mb-2">{team.division}</TableCell>
                      <TableCell className="w-[200px]">
                        <Button
                          className="w-36 h-12 text-sm rounded-full bg-blue-500 text-white dark:bg-blue-600 dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-blue-700 transition"
                          disabled={actionLoading || pendingRequests.length + acceptedRequests.length >= 3}
                          onPress={() => handleRequestJoin(team.id, team.name)}
                        >
                          {pendingRequests.length + acceptedRequests.length >= 3 ? "Limit Reached" : "Request to Join"}
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
