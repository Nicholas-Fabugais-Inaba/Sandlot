import React, { useState, useEffect } from 'react';
import { Button } from '@heroui/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (firstName: string, lastName?: string, confirmValue?: string) => void;
  title: string;
  initialValue: string;
  isPassword?: boolean;
  isNameChange?: boolean;
}

const ChangeInfoModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, title, initialValue, isPassword = false, isNameChange = false }) => {
  const [value, setValue] = useState(initialValue);
  const [confirmValue, setConfirmValue] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    setValue(initialValue);
    if (isNameChange) {
      const [first, last] = initialValue.split(' ');
      setFirstName(first || '');
      setLastName(last || '');
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
              type="text"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </>
        ) : (
          <input
            type={isPassword ? "password" : "text"}
            className="w-full px-4 py-2 border rounded-lg mb-4"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete={isPassword ? "new-password" : "off"}
          />
        )}
        {isPassword && (
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg mb-4"
            placeholder="Confirm Password"
            value={confirmValue}
            onChange={(e) => setConfirmValue(e.target.value)}
            autoComplete="new-password"
          />
        )}
        <div className="flex justify-end space-x-4">
          <Button onPress={onClose} className="button">
            Cancel
          </Button>
          <Button onPress={() => isNameChange ? onSubmit(firstName, lastName) : onSubmit(value, confirmValue)} className="button">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangeInfoModal;