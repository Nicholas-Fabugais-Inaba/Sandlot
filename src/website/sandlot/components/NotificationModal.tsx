// components/NotificationModal.tsx

import { FC, useState, useEffect } from "react";

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  timestamp: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLDivElement>; // Reference to the bell icon
}

export const NotificationModal: FC<NotificationModalProps> = ({ isOpen, onClose, anchorRef }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: "Notification 1", isRead: false, timestamp: "2025-03-18T12:30:00" },
    { id: 2, message: "Notification 2", isRead: false, timestamp: "2025-03-18T12:35:00" },
    { id: 3, message: "Notification 3", isRead: true, timestamp: "2025-03-17T10:00:00" },
    // Add more notifications as needed
  ]);

  const [bellPosition, setBellPosition] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateBellPosition = () => {
      if (anchorRef.current) {
        setBellPosition(anchorRef.current.getBoundingClientRect());
      }
    };

    // Update position on mount
    updateBellPosition();

    // Update position on resize
    window.addEventListener('resize', updateBellPosition);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', updateBellPosition);
    };
  }, [anchorRef]);

  if (!isOpen) return null; // Don't render if the modal is closed

  // Function to calculate the time difference
  const timeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMs = now.getTime() - date.getTime();
    const diffInSec = Math.floor(diffInMs / 1000);
    const diffInMin = Math.floor(diffInSec / 60);
    const diffInHour = Math.floor(diffInMin / 60);

    if (diffInSec < 60) return `${diffInSec} seconds ago`;
    if (diffInMin < 60) return `${diffInMin} minutes ago`;
    if (diffInHour < 24) return `${diffInHour} hours ago`;

    const isSameYear = now.getFullYear() === date.getFullYear();
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    if (!isSameYear) {
      options.year = 'numeric';
    }
    return date.toLocaleString('en-US', options);
  };

  // Function to mark all notifications as read
  const markAllRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  return (
    <div
      className="fixed z-50 bg-transparent"
      style={{
        top: bellPosition?.bottom ?? 0, // Position the modal just below the bell
        left: (bellPosition?.left ?? 0) - 300,   // Adjust the left position as needed
        width: bellPosition?.width ?? 'auto',
      }}
    >
      <div className="bg-white rounded-lg shadow-lg w-96 max-h-80">
        {/* Header with title, close button, and Mark All Read button */}
        <div className="flex justify-between items-center p-4 border-b">
            <span className="font-bold text-lg">Notifications</span>
            <div className="flex items-center space-x-2">
                <button
                onClick={markAllRead}
                className="text-sm text-blue-500 hover:underline"
                >
                Mark All Read
                </button>
                <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900 text-2xl"
                >
                &times; {/* Close button (X) */}
                </button>
            </div>
        </div>


        {/* Scrollable content */}
        <div className="p-4 overflow-y-auto max-h-64">
          <ul className="space-y-2">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-4 border rounded-lg ${notification.isRead ? 'bg-white' : 'bg-blue-100'}`}
              >
                <p>{notification.message}</p>
                <p className="text-xs text-gray-500">{timeAgo(notification.timestamp)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
