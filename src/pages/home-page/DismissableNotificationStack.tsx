import React, { useState } from "react";
import { Notification } from "../../common/types";
import '../../styles/Common.css';
import axios from "axios";
import DismissableNotification from "./DismissableNotification";

interface DismissableNotificationStackProps {
  initialNotifications: Notification[];
}

const DismissableNotificationStack: React.FC<DismissableNotificationStackProps> = ({ initialNotifications }) => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const onDismiss = (notificationId: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.notificationId !== notificationId)
    );
  };

  const handleDismiss = async (notificationId: string) => {
    console.log(notificationId)
    // Call backend API or perform any desired action
    try {
      await axios.post(`/api/notifications/${notificationId}`);
      onDismiss(notificationId);
    } catch (error) {
      console.error("Error dismissing notification:", error);
    }
  };


  return (
    <>
      <div className="vw-35 vh-100 bg-transparent overflow-auto flex flex-col justify-end">
        {notifications.map((notification) => (

          <DismissableNotification key={notification.notificationId} notification={notification} onClick={function (notification: Notification): void {
            console.log("Clicked notification of type: " + notification.notificationType)
          }} onClose={function (notification: Notification): void {
            handleDismiss(notification.notificationId);
            console.log("Dismissing notification with ID: " + notification.notificationId);
          }} actions={[(notification: Notification) => console.log(notification)]} />
        ))}
      </div>
    </>
  );
};

export default DismissableNotificationStack;
