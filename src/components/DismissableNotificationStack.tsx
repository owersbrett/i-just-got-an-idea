import React, { useContext, useEffect, useState } from "react";
import { Notification } from '../common/types/notification';
import '../styles/Common.css';
import axios, { AxiosError, AxiosResponse } from "axios";
import DismissableNotification from "./DismissableNotification";
import { UserContext } from "@/pages/auth-page/UserContext";
import { API, ErrorCallback, SuccessCallback } from "@/pages/api/api";

interface DismissableNotificationStackProps {
  initialNotifications: Notification[];
}

const DismissableNotificationStack: React.FC<DismissableNotificationStackProps> = ({ initialNotifications }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const { user } = useContext(UserContext);



  const onDismiss = (notificationId: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.notificationId !== notificationId)
    );
  };

  const fetchNotifications = () => {
    if (user){
      console.log("Fetching latest notifications...")

        API.post(`/api/notification`, notifications.length > 0 ? notifications[0] : Notification.new(user.uid, "Welcome to the session!", "session"), "Error getting notifications: ")
            .then((response) => {
                if (response.data) {
                    let currentNotifications = response.data.notifications as Notification[];
                    setNotifications(currentNotifications);
                }

            }, (error) => {
                console.error(error);
            });
    }
}


useEffect(() => {
  if (user){
    console.log("User exists");
    startPolling();
  } else {
    console.log("No user")
  }
}, [user]);

const startPolling = () => {
    fetchNotifications();

    setInterval(fetchNotifications, 15000);
}




  const handleDismiss = async (notificationId: string) => {
    // Call backend API or perform any desired action
    try {
      await axios.post(`/api/notification/${notificationId}`, {"notificationId": notificationId, "userId": user?.uid});
      onDismiss(notificationId);
    } catch (error) {
      console.error("Error dismissing notification:", error);
    }
  };
  useEffect(() => {
    console.info("New notifications!", initialNotifications)
    setNotifications(initialNotifications);
  }, [initialNotifications]);


  return (
    <>
      <div className="vw-35 vh-100 overflow-auto flex flex-col justify-end">
        {notifications.map((notification) => (
      
          <DismissableNotification key={notification.notificationId} notification={notification} onClick={function (notification: Notification): void {
            console.log("Clicked notification of type: " + notification.notificationType)
          }} onClose={function (notification: Notification): void {
            handleDismiss(notification.notificationId);
          }} actions={[(notification: Notification) => console.log(notification)]} />
        ))}
      </div>
    </>
  );
};

export default DismissableNotificationStack;
