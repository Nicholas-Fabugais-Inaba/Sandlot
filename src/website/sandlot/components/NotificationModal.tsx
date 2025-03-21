// components/NotificationModal.tsx

import { FC, useState, useEffect } from "react";
import getRR from "../app/functions/getRR"; // Adjust the import path
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";

interface RescheduleRequest {
  id: number;
  requester_name: string;
  originalDate: Date;
}

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
  team_id: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>; // Function to update the unread count
}

export const NotificationModal: FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  anchorRef,
  team_id,
  setUnreadCount, // Add the setUnreadCount function here
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [bellPosition, setBellPosition] = useState<DOMRect | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;

    (async () => {
      try {
        const session = await getSession();
        // const rrList: RescheduleRequest[] = await getRR({ team_id: session?.user.team_id });
        // Mock reschedule requests
        const rrList = [
          {
            id: 1,
            requester_name: "John Doe",
            originalDate: new Date("2025-03-18T15:30:00"),
          },
          {
            id: 2,
            requester_name: "Jane Smith",
            originalDate: new Date("2025-03-17T12:00:00"),
          },
        ];

        const formattedNotifications = rrList.map((rr: RescheduleRequest) => ({
          id: rr.id,
          message: `Reschedule request from ${rr.requester_name} for ${rr.originalDate.toLocaleString()}`,
          isRead: false,
          timestamp: rr.originalDate.toISOString(),
        }));

        setNotifications(formattedNotifications);
        setUnreadCount(formattedNotifications.filter((notification) => !notification.isRead).length); // Set unread count
      } catch (error) {
        console.error("Error fetching reschedule requests:", error);
      }
    })();
  }, [isOpen, team_id]);

  useEffect(() => {
    const updateBellPosition = () => {
      if (anchorRef.current) {
        setBellPosition(anchorRef.current.getBoundingClientRect());
      }
    };
    updateBellPosition();
    window.addEventListener("resize", updateBellPosition);
    return () => {
      window.removeEventListener("resize", updateBellPosition);
    };
  }, [anchorRef]);

  if (!isOpen) return null;

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
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    if (!isSameYear) {
      options.year = "numeric";
    }

    return date.toLocaleString("en-US", options);
  };

  const markAllRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
    setUnreadCount(0); // Reset unread count when all are marked as read
  };

  return (
    <div
      className="fixed z-50 bg-transparent"
      style={{
        top: bellPosition?.bottom ?? 0,
        left: (bellPosition?.left ?? 0) - 300,
        width: bellPosition?.width ?? "auto",
      }}
    >
      <div className="bg-white rounded-lg shadow-lg w-96 max-h-80">
        <div className="flex justify-between items-center p-4 border-b">
          <span className="font-bold text-lg">Notifications</span>
          <div className="flex items-center space-x-2">
            <button
              className="text-sm text-blue-500 hover:underline"
              onClick={markAllRead}
            >
              Mark All Read
            </button>
            <button
              className="text-gray-600 hover:text-gray-900 text-2xl"
              onClick={onClose}
            >
              &times;
            </button>
          </div>
        </div>
        <div className="p-4 overflow-y-auto max-h-64">
          {notifications.length > 0 ? (
            <ul className="space-y-2">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`relative p-4 border rounded-lg ${
                    notification.isRead ? "bg-gray-100" : "bg-blue-100"
                  }`} // Change background based on isRead
                >
                  <p>{notification.message}</p>
                  <p className="text-xs text-gray-500">{timeAgo(notification.timestamp)}</p>
                  <Button
                    className="absolute bottom-4 right-4 bg-blue-500 text-white rounded-full w-16 h-8 text-xs"
                    onPress={() => router.push("/manage-reschedule-request")}
                  >
                    View
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No notifications</p>
          )}
        </div>
      </div>
    </div>
  );
};
