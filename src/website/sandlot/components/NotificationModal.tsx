// components/NotificationModal.tsx

import { FC, useState, useEffect, useCallback } from "react";
import getRR from "../app/functions/getRR"; // Adjust the import path
import getAllTimeslots from "../app/functions/getAllTimeslots";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";

interface RescheduleRequest {
  id: number;
  requester_name: string;
  originalDate: Date;
  isRead?: boolean;
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
  team_id: number | undefined;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>; // Function to update the unread count
}

export const NotificationModal: FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  anchorRef,
  team_id,
  setUnreadCount, // Add the setUnreadCount function here
}) => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [bellPosition, setBellPosition] = useState<{top: number, left: number, width: number} | null>(null);

  const router = useRouter();

  const [fetchTime, setFetchTime] = useState<Date | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchNotifications = async () => {
        try {
          const session = await getSession();
          const timeslotsResponse = await getAllTimeslots();
          const [rrList, pendingRequests] = await getRR({ team_id: session?.user.team_id }, timeslotsResponse, false);
          console.log("Reschedule Requests: ", rrList);

          const currentTime = new Date();
          setFetchTime(currentTime);

          // Ensure each notification has a unique ID
          const formattedNotifications = rrList
            .filter((rr: RescheduleRequest) => !rr.isRead)
            .map((rr: RescheduleRequest, index: number) => {
              const date = rr.originalDate ? new Date(rr.originalDate) : new Date();
              return {
                id: rr.id || index, // Fallback ID if rr.id is undefined
                message: `Reschedule request from ${rr.requester_name} for ${date.toLocaleString()}`,
                isRead: false,
                timestamp: currentTime.toISOString(),
              };
            });

          setNotifications(formattedNotifications);
          setUnreadCount(formattedNotifications.length);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching reschedule requests:", error);
          setLoading(false);
        }
      };

      fetchNotifications();
    }
  }, [isOpen, team_id, setUnreadCount]);

  // Move position update logic to a separate useEffect
  useEffect(() => {
    if (!isOpen || !anchorRef.current) return;

    const updateBellPosition = () => {
      if (anchorRef.current) {
        const rect = anchorRef.current.getBoundingClientRect();
        setBellPosition({
          top: rect.bottom,
          left: rect.left - 300,
          width: rect.width
        });
      }
    };

    updateBellPosition();
    window.addEventListener("resize", updateBellPosition);
    
    return () => {
      window.removeEventListener("resize", updateBellPosition);
    };
  }, [isOpen, anchorRef]);

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

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(notification => ({
      ...notification,
      isRead: true,
    })));
    setUnreadCount(0);
  }, [setUnreadCount]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50 bg-transparent"
      style={{
        top: bellPosition?.top ?? 0,
        left: bellPosition?.left ?? 0,
        width: bellPosition?.width ?? "auto",
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96 max-h-80">
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
                  className={`relative p-4 border rounded-lg h-24 ${
                    notification.isRead ? "bg-gray-100 dark:bg-gray-700" : "bg-blue-100 dark:bg-blue-500"
                  }`} // Change background based on isRead
                >
                  <p>{notification.message}</p>
                  {/* <p className="text-xs text-gray-500 dark:text-gray-300">{timeAgo(notification.timestamp)}</p> */}
                  <Button
                    className="absolute bottom-4 right-4 bg-blue-500 text-white rounded-full w-16 h-8 text-xs 
                    hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-300 dark:text-black"              
                    onPress={() => router.push("/manage-reschedule-request")}
                  >
                    View
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-300">No notifications</p>
          )}
        </div>
      </div>
    </div>
  );
};
