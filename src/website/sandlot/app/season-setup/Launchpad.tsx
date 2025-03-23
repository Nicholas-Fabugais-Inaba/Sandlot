// app/season-setup/Launchpad.tsx

"use client";

import { useState } from "react";
import { Button, Modal } from "@heroui/react";

interface LaunchProps {
  seasonState: "offseason" | "preseason" | "season";
}

export default function Launchpad({ seasonState }: LaunchProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLaunchClick = () => {
    setIsModalOpen(true);
  };
  
  const handleConfirmLaunchSeason = () => {
    setIsModalOpen(false);
    // Add logic to launch the respective mode here
    alert(`Season Launched!`);
  }

  const handleConfirmEndSeason = () => {
    setIsModalOpen(false);
    // Add logic to launch the respective mode here
    alert(`Season ended!`);
  }

  const handleConfirmLaunchPreseason = () => {
    setIsModalOpen(false);
    // Add logic to launch the respective mode here
    alert(`Preseason Launched!`);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getDescription = () => {
    switch (seasonState) {
      case "offseason":
        return "Launching the pre-season will allow new team and player accounts to be created and old player and team accounts to be reactivated. The season start and end dates will be shown to all users and team accounts will be able to choose their preferred division from the list in division settings. Make sure all settings are configured correctly before proceeding.";
      case "preseason":
        return "Launching the season will start the official games and competitions. Make sure all teams are ready and schedules are set.";
      case "season":
        return "Ending the season will put the system into offseason. Ending the season will deactivate all team and player accounts for the season. Users may reactivate their accounts in the next preseason.";
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

  const handleConfirm = () => {
    switch (seasonState) {
      case "offseason":
        handleConfirmLaunchPreseason();
        break;
      case "preseason":
        handleConfirmLaunchSeason();
        break;
      case "season":
        handleConfirmEndSeason();
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{`${seasonState.charAt(0).toUpperCase() + seasonState.slice(1)} Launch`}</h1>
      <p className="mb-4">{getDescription()}</p>
      <Button
        className="bg-red-500 text-white px-6 py-3 rounded-lg"
        onPress={handleLaunchClick}
      >
        {getButtonText()}
      </Button>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title="Confirm Launch"
        >
          <div className="p-4">
            <p>Are you sure?</p>
            <div className="flex justify-end mt-4">
              <Button className="mr-2" onPress={handleCancel}>
                Cancel
              </Button>
              <Button className="bg-red-500 text-white" onPress={handleConfirm}>
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}