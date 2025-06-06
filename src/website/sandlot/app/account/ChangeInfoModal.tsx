import React, { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import styles from "./ChangeInfoModal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (firstName: string, lastName?: string, confirmValue?: string) => void;
  title: string;
  initialValue: string;
  isPassword?: boolean;
  isNameChange?: boolean;
  isEmailChange?: boolean;
  firstName?: string; // Add firstName prop
  lastName?: string;  // Add lastName prop
  isTeamDisplayChange?: boolean; // New prop for team display name change
  isTeamUsernameChange?: boolean; // New prop for team username change
}

const ChangeInfoModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialValue,
  isPassword = false,
  isNameChange = false,
  isEmailChange = false,
  isTeamDisplayChange = false,
  isTeamUsernameChange = false,
  firstName = "", // Default to empty string
  lastName = "", // Default to empty string
}) => {
  const [value, setValue] = useState(initialValue);
  const [confirmValue, setConfirmValue] = useState("");
  const [currentFirstName, setCurrentFirstName] = useState<string>(""); // Use firstName prop
  const [currentLastName, setCurrentLastName] = useState<string>("");   // Use lastName prop
  const [email, setEmail] = useState(""); // New state for email
  const [confirmEmail, setConfirmEmail] = useState(""); // New state for confirming email
  const [teamDisplayName, setTeamDisplayName] = useState(""); // State for team display name
  const [teamUsername, setTeamUsername] = useState(""); // State for team username

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  useEffect(() => {

    // Currently commenting out initial value functionality
    // if (isEmailChange) {
    //   setEmail(initialValue);
    //   setConfirmEmail("");
    // } else if (isPassword) {
    //   setValue(initialValue);
    //   setConfirmValue("");
    // } else if (isNameChange) {
    //   setCurrentFirstName(firstName);
    //   setCurrentLastName(lastName);
    // } else

    setValue(""); // Clear password
    setConfirmValue(""); // Clear confirm password
    setEmail(""); // Clear email
    setConfirmEmail(""); // Clear confirm email
  
    // Clear errors when switching modes
    setErrors({});
  }, [isEmailChange, isPassword, isNameChange, isTeamDisplayChange, isTeamUsernameChange]);

  const validateEmail = (email: string) => {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      email
    );
  };

  const handleSubmit = () => {
    const newErrors: typeof errors = {};
  
    if (isNameChange) {
      if (!firstName.trim()) {
        newErrors.general = "First name is required.";
      }
      if (!lastName.trim()) {
        newErrors.general = "Last name is required.";
      }
    } else if (isEmailChange) {
      if (!validateEmail(email)) {
        newErrors.email = "Invalid email format.";
      }
      if (email !== confirmEmail) {
        newErrors.email = "Emails do not match.";
      }
    } else if (isPassword) {
      if (!value.trim()) {
        newErrors.password = "Password is required.";
      }
      if (value !== confirmValue) {
        newErrors.password = "Passwords do not match.";
      }
    } else if (isTeamDisplayChange) {
      if (!teamDisplayName.trim()) {
        newErrors.general = "Display name is required.";
      }
    } else if (isTeamUsernameChange) {
      if (!teamUsername.trim()) {
        newErrors.general = "Username is required.";
      }
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    setErrors({});
    if (isNameChange) {
      onSubmit(currentFirstName, currentLastName);
    } else if (isEmailChange) {
      onSubmit(email, confirmEmail);
    } else if (isTeamDisplayChange) {
      onSubmit(teamDisplayName); // Submit team display name
    } else if (isTeamUsernameChange) {
      onSubmit(teamUsername); // Submit team username
    } else {
      onSubmit(value, confirmValue);
    }
  };

  const handleClose = () => {
    setErrors({}); // Clear errors
    setValue(""); // Clear the password input field
    setConfirmValue("");
    setCurrentFirstName(""); // Clear first name
    setCurrentLastName(""); // Clear last name
    setEmail(""); // Clear email
    setConfirmEmail(""); // Clear confirm email
    setTeamDisplayName(""); // Clear team display name
    setTeamUsername(""); // Clear team username
    onClose(); // Call the provided onClose function
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className={styles.errorContainer}>
          {errors.general && <p className={styles.errorMessage}>{errors.general}</p>}
          {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
          {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
        </div>
        {isNameChange && (
          <>
            <input
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="First Name"
              type="text"
              value={currentFirstName}
              onChange={(e) => {
                setCurrentFirstName(e.target.value);
                const newErrors = { ...errors };
                delete newErrors.general;
                setErrors(newErrors);
              }}
            />
            <input
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="Last Name"
              type="text"
              value={currentLastName}
              onChange={(e) => {
                setCurrentLastName(e.target.value);
                const newErrors = { ...errors };
                delete newErrors.general;
                setErrors(newErrors);
              }}
            />
          </>
        )}
        {isEmailChange && (
          <>
            <input
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="New Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                const newErrors = { ...errors };
                delete newErrors.email;
                setErrors(newErrors);
              }}
            />
            <input
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="Confirm New Email"
              type="email"
              value={confirmEmail}
              onChange={(e) => {
                setConfirmEmail(e.target.value);
                const newErrors = { ...errors };
                delete newErrors.email;
                setErrors(newErrors);
              }}
            />
          </>
        )}
        {isPassword && (
          <>
            <input
              autoComplete="new-password"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="New Password"
              type="password"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                const newErrors = { ...errors };
                delete newErrors.password;
                setErrors(newErrors);
              }}
            />
            <input
              autoComplete="new-password"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="Confirm New Password"
              type="password"
              value={confirmValue}
              onChange={(e) => {
                setConfirmValue(e.target.value);
                const newErrors = { ...errors };
                delete newErrors.password;
                setErrors(newErrors);
              }}
            />
          </>
        )}
          {isTeamDisplayChange && (
            <input
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="New display name"
              type="text"
              value={teamDisplayName}
              onChange={(e) => {
                setTeamDisplayName(e.target.value);
                const newErrors = { ...errors };
                delete newErrors.general;
                setErrors(newErrors);
              }}
            />
          )}
          {isTeamUsernameChange && (
            <input
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="New username"
              type="text"
              value={teamUsername}
              onChange={(e) => {
                setTeamUsername(e.target.value);
                const newErrors = { ...errors };
                delete newErrors.general;
                setErrors(newErrors);
              }}
            />
          )}
        <div className="flex justify-end space-x-4">
        <Button className="button" onPress={handleClose}>
          Cancel
        </Button>
          <Button className="button" onPress={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangeInfoModal;