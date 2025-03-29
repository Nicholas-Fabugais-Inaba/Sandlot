import React, { useState, useEffect } from "react";
import { Button } from "@heroui/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    firstName: string,
    lastName?: string,
    confirmValue?: string,
  ) => void;
  title: string;
  initialValue: string;
  isPassword?: boolean;
  isNameChange?: boolean;
}

const ChangeInfoModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialValue,
  isPassword = false,
  isNameChange = false,
}) => {
  const [value, setValue] = useState(initialValue);
  const [confirmValue, setConfirmValue] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    setValue(initialValue);
    if (isNameChange) {
      const [first, last] = initialValue.split(" ");

      setFirstName(first || "");
      setLastName(last || "");
    }
  }, [initialValue, isNameChange]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {isNameChange ? (
          <>
            <input
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </>
        ) : (
          <input
            autoComplete={isPassword ? "new-password" : "off"}
            className="w-full px-4 py-2 border rounded-lg mb-4"
            placeholder="New Password"
            type={isPassword ? "password" : "text"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )}
        {isPassword && (
          <input
            autoComplete="new-password"
            className="w-full px-4 py-2 border rounded-lg mb-4"
            placeholder="Confirm New Password"
            type="password"
            value={confirmValue}
            onChange={(e) => setConfirmValue(e.target.value)}
          />
        )}
        <div className="flex justify-end space-x-4">
          <Button className="button" onPress={onClose}>
            Cancel
          </Button>
          <Button
            className="button"
            onPress={() =>
              isNameChange
                ? onSubmit(firstName, lastName)
                : onSubmit(value, confirmValue)
            }
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangeInfoModal;
