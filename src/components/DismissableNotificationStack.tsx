import React, { useContext, useEffect, useState } from "react";
import { Notification } from '../common/types';
import '../styles/Common.css';
import axios from "axios";
import DismissableNotification from "./DismissableNotification";
import { UserContext } from "@/pages/auth-page/UserContext";
import { API } from "@/pages/api/api";

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
    console.log("polling");
    if (user){

        API.post(`/api/notification`, notifications.length > 0 ? notifications[0] : Notification.new(user.uid, "Welcome to the session!", "session"), "Error getting notifications: ")
            .then((response) => {
                console.log("RESPONSE------------------");
                console.log(response);
                if (response.data) {
                    let currentNotifications = response.data.notifications as Notification[];
                    setNotifications(currentNotifications);
                }

            }, (error) => {
                console.log(error);
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
    // setInterval(fetchNotifications, 60000);
    setInterval(fetchNotifications, 5000);
}




  const handleDismiss = async (notificationId: string) => {
    console.log(notificationId)
    // Call backend API or perform any desired action
    try {
      await axios.post(`/api/notification/${notificationId}`, {"notificationId": notificationId, "userId": user?.uid});
      onDismiss(notificationId);
    } catch (error) {
      console.error("Error dismissing notification:", error);
    }
  };
  useEffect(() => {
    console.log("New notifications!", initialNotifications)
    setNotifications(initialNotifications);
  }, [initialNotifications]);


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
