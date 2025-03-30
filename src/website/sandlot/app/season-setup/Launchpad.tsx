"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import ConfirmationDialog from "./ConfirmationDialog";
import preseasonToSeason from "../functions/preseasonToSeason";
import offseasonToPreseason from "../functions/offseasonToPreseason";
import endSeason from "../functions/endSeason";

interface LaunchProps {
  seasonState: string;
}

export default function Launchpad({ seasonState }: LaunchProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<string>();

  const handleLaunchClick = (action: string) => {
    console.log("dialog opening with action:", action);
    setDialogAction(action);
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    setIsDialogOpen(false);
    switch (dialogAction) {
      case "launchPreseason":
        await offseasonToPreseason()
        break;
      case "launchSeason":
        await preseasonToSeason()
        break;
      case "endSeason":
        await endSeason({archive_teams: false})
        break;
      case "returnPreseason":
        alert(`Returned to Preseason!`);
        break;
      default:
        break;
    }
    window.location.reload();
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  const getDescription = () => {
    switch (seasonState) {
      case "offseason":
        return "Launching the Preseason will allow new team and player accounts to be created and old player and team accounts to be reactivated. The season start and end dates will be shown to all users and team accounts will be able to choose their preferred division from the list in division settings. Make sure all settings are configured correctly before proceeding.";
      case "preseason":
        return "Launching the Season will start the official games and competitions. Make sure all teams are ready and schedules are set.";
      case "season":
        return "Ending the Season will put the system into offseason. Ending the season will deactivate all team and player accounts for the season. Users may reactivate their accounts in the next preseason.";
      default:
        return "";
    }
  };

  const getButtonText = () => {
    switch (seasonState) {
      case "offseason":
        return "Launch Preseason";
      case "preseason":
        return "Launch Season";
      case "season":
        return "End Season";
      default:
        return "Launch";
    }
  };

  const returnWarning = "Warning, returning to the preseason may revert changes team accounts have made to the schedule."

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4">{getButtonText()}</h2>
      <p className="mt-4 mb-6 text-gray-700 text-lg">{getDescription()}</p>      {seasonState === "season" && (
        <div className="flex space-x-4">
          <Button
            className="bg-red-500 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-red-600 transition"
            onPress={() => handleLaunchClick("endSeason")}
          >
            End Season
          </Button>
          {/* <Button
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg"
            onPress={() => handleLaunchClick("returnPreseason")}
          >
            Return to Preseason
          </Button> */}
        </div>
      )}
      {seasonState !== "season" && (
        <Button
          className="bg-red-500 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-red-600 transition"
          onPress={() => handleLaunchClick(seasonState === "offseason" ? "launchPreseason" : "launchSeason")}
        >
          {getButtonText()}
        </Button>
      )}

      <ConfirmationDialog
        isOpen={isDialogOpen}
        title="Confirm Launch"
        message={`Are you sure you want to ${dialogAction === "launchPreseason" ? "launch the preseason" : dialogAction === "launchSeason" ? "launch the season" : dialogAction === "endSeason" ? "end the season" : "return to preseason. " + returnWarning}?`}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}