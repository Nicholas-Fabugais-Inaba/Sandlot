// app/season-setup/pre-season-launch.tsx

"use client";

import { useState } from "react";
import { Button, Modal } from "@heroui/react";

export default function PreSeasonLaunch() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLaunchClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    // Add logic to launch the pre-season here
    alert("Pre-Season Launched!");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pre-Season Launch</h1>
      <p className="mb-4">
        Launching the pre-season will allow new team and player accounts to be created and old player and team accounts to be reactivated.
        The season start and end dates will be shown to all users and team accounts will be able to choose their preferred division from the list in division settings.
        Make sure all settings are configured correctly before proceeding.
      </p>
      <Button
        className="bg-red-500 text-white px-6 py-3 rounded-lg"
        onPress={handleLaunchClick}
      >
        Launch Pre-Season
      </Button>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title="Confirm Launch"
        >
          <div className="p-4">
            <p>Are you sure you want to launch the pre-season?</p>
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
