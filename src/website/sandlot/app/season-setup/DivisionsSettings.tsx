import { useState, useEffect, useRef } from "react";
import { useDrag, useDrop, DndProvider, DragSourceMonitor, DropTargetMonitor } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import getTeamsSeasonSetup from "../functions/getTeamsSeasonSetup";
import updateTeamDivisions from "../functions/updateTeamDivisions";
import updateDivisions from "../functions/updateDivisions";

const ItemTypes = {
  TEAM: "team",
};

interface DragItem {
  index: number;
  division_id: number;
}

interface Team {
  id: number;
  name: string;
  preferredDivision: string;
}

interface Division {
  id: number;
  name: string;
  teams: Team[];
}

interface TeamProps {
  team: Team;
  index: number;
  division_id: number;
  moveTeam: (
    dragIndex: number,
    hoverIndex: number,
    sourceDivisionId: number,
    targetDivisionId: number,
  ) => void;
  setIsDragging: (isDragging: boolean) => void;
  setSourceDivision: (division_id: number | null) => void;
}

const Team: React.FC<TeamProps> = ({
  team,
  index,
  division_id,
  moveTeam,
  setIsDragging,
  setSourceDivision,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TEAM,
    item: () => {
      setSourceDivision(division_id);
      return { index, division_id };
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      setIsDragging(false);
      setSourceDivision(null);
    },
  });

  useEffect(() => {
    setIsDragging(isDragging);
  }, [isDragging, setIsDragging]);

  drag(ref);

  return (
    <div
      ref={ref}
      className="flex items-center justify-between p-2 border rounded-lg mb-2"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <span>{team.name}</span>
      <span className="text-xs text-gray-500">
        Preferred: {team.preferredDivision}
      </span>
    </div>
  );
};

interface DivisionProps {
  division: Division;
  moveTeam: (
    dragIndex: number,
    hoverIndex: number,
    sourceDivisionId: number,
    targetDivisionId: number,
  ) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  sourceDivision: number | null;
  setSourceDivision: (division_id: number | null) => void;
  removeDivision: (divisionId: number) => void; // Add this prop
}

const Division: React.FC<DivisionProps> = ({
  division,
  moveTeam,
  isDragging,
  setIsDragging,
  sourceDivision,
  setSourceDivision,
  removeDivision, // Add this prop
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop<DragItem>({
    accept: ItemTypes.TEAM,
    drop(item: DragItem, monitor: DropTargetMonitor) {
      const hoverIndex = division.teams.length;

      if (item.division_id !== division.id || item.index !== hoverIndex) {
        moveTeam(item.index, hoverIndex, item.division_id, division.id);
        item.index = hoverIndex;
        item.division_id = division.id;
      }
    },
  });

  drop(ref);

  const [showMessage, setShowMessage] = useState(false);

  const handleRemoveClick = () => {
    if (division.teams.length > 0) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    } else {
      removeDivision(division.id);
    }
  };

  return (
    <div
      ref={ref}
      className={`division drop-target ${sourceDivision === division.id ? "highlight" : ""}`}
      style={division.name === "Team Bank" ? { minHeight: "150px" } : {}}
    >
      <h3>{division.name}</h3>
      {division.teams.length === 0 ||
      (isDragging && division.name !== "Team Bank") ? (
        <div className="empty-division">Drop teams here</div>
      ) : (
        division.teams.map((team, index) => (
          <Team
            key={team.id}
            division_id={division.id}
            index={index}
            moveTeam={moveTeam}
            setIsDragging={setIsDragging}
            setSourceDivision={setSourceDivision}
            team={team}
          />
        ))
      )}
      {!isDragging && division.name !== "Team Bank" && (
        <div>
          <button
            className={`mt-2 px-4 py-2 rounded-lg text-white ${division.teams.length > 0 ? "bg-gray-500" : "bg-red-500"}`}
            onClick={handleRemoveClick}
          >
            Remove Division
          </button>
          {showMessage && (
            <span className="fade-out"> Only empty divisions can be removed</span>
          )}
        </div>
      )}
    </div>
  );
};

interface DivisionsSettingsProps {
  setUnsavedChanges: (hasChanges: boolean) => void;
}

export default function DivisionsSettings({ setUnsavedChanges }: DivisionsSettingsProps) {
  const [isDivisionsEnabled, setIsDivisionsEnabled] = useState<boolean>(true);
  const [divisions, setDivisions] = useState<Division[]>([
    { id: 0, name: "Team Bank", teams: [] },
  ]);
  const [newDivision, setNewDivision] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [sourceDivision, setSourceDivision] = useState<number | null>(null);

  useEffect(() => {
    const loadDivisionData = async () => {
      const data = await getTeamsSeasonSetup();

      setDivisions(data);
    };

    loadDivisionData();
  }, []);

  const toggleDivisions = () => {
    setIsDivisionsEnabled((prev) => !prev);
    setUnsavedChanges(true);
  };

  const addDivision = () => {
    if (newDivision.trim() !== "") {
      const newDivisionId =
        divisions.length > 0 ? Math.max(...divisions.map((d) => d.id)) + 1 : 1;

      setDivisions((prev) => [
        ...prev,
        { id: newDivisionId, name: newDivision, teams: [] },
      ]);
      setNewDivision("");
      setUnsavedChanges(true);
    }
  };

  const moveTeam = (
    dragIndex: number,
    hoverIndex: number,
    sourceDivisionId: number,
    targetDivisionId: number,
  ) => {
    if (sourceDivisionId === targetDivisionId) {
      return;
    }

    const sourceDivision = divisions.find(
      (division) => division.id === sourceDivisionId,
    );
    const targetDivision = divisions.find(
      (division) => division.id === targetDivisionId,
    );

    if (!sourceDivision || !targetDivision) {
      return;
    }

    const sourceTeams = [...sourceDivision.teams];
    const [movedTeam] = sourceTeams.splice(dragIndex, 1);
    const targetTeams = [...targetDivision.teams];

    targetTeams.splice(hoverIndex, 0, movedTeam);

    setDivisions((prev) =>
      prev.map((division) =>
        division.id === sourceDivisionId
          ? { ...division, teams: sourceTeams }
          : division.id === targetDivisionId
            ? { ...division, teams: targetTeams }
            : division,
      ),
    );
    setUnsavedChanges(true);
  };

  const removeDivision = (divisionId: number) => {
    setDivisions((prev) => prev.filter((division) => division.id !== divisionId));
    setUnsavedChanges(true);
  };

  const saveDivisions = async () => {
    alert("Divisions save button pressed.");
    updateDivisions(divisions);
    updateTeamDivisions(divisions);
    setUnsavedChanges(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Division Settings</h2>

      <div className="mb-4 flex items-center">
        <input
          checked={isDivisionsEnabled}
          className="mr-2"
          id="toggleDivisions"
          type="checkbox"
          onChange={toggleDivisions}
        />
        <label className="text-gray-700" htmlFor="toggleDivisions">
          Enable Divisions
        </label>
      </div>

      {isDivisionsEnabled && (
        <div className="flex">
          <div
            className="divisions-container flex-grow"
            style={{ width: "60%" }}
          >
            <div className="mb-4 flex">
              <input
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Division Name"
                type="text"
                value={newDivision}
                onChange={(e) => setNewDivision(e.target.value)}
              />
              <button
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                type="button"
                onClick={addDivision}
              >
                Add Division
              </button>
            </div>

            <div
              className="divisions-list overflow-y-auto"
              style={{ maxHeight: "60vh" }}
            >
              {divisions
                .filter((division) => division.name !== "Team Bank")
                .map((division) => (
                  <div key={division.id} className="division-container">
                    <Division
                      division={division}
                      isDragging={isDragging}
                      moveTeam={moveTeam}
                      setIsDragging={setIsDragging}
                      sourceDivision={sourceDivision}
                      setSourceDivision={setSourceDivision}
                      removeDivision={removeDivision} // Pass the removeDivision function
                    />
                  </div>
                ))}
            </div>
          </div>

          <div
            className="team-bank-container flex-shrink-0 ml-4"
            style={{ width: "40%", position: "sticky", top: "10px" }}
          >
            <p className="mb-4">Drag and drop teams to their divisions. Teams left in the team bank will not be scheduled games.</p>
            <Division
              division={
                divisions.find((division) => division.name === "Team Bank")!
              }
              isDragging={isDragging}
              moveTeam={moveTeam}
              setIsDragging={setIsDragging}
              sourceDivision={sourceDivision}
              setSourceDivision={setSourceDivision}
              removeDivision={removeDivision} // Pass the removeDivision function
            />
            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
                type="button"
                onClick={saveDivisions}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}