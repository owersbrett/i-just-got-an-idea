import { Notification } from "../common/types/notification"

import React, { useState } from "react";
import '../styles/Common.css';
import axios from "axios";
import ToastIcon from "./ToastIcon";


interface DismissableNotificationStackProps {
    notification: Notification;
    onClick: (notification: Notification) => void;
    onClose: (notification: Notification) => void;
    actions: [(notification: Notification) => void];
}


const DismissableNotification: React.FC<DismissableNotificationStackProps> = ({ notification, onClick, onClose, actions }) => {
    const [dismissed, setDismissed] = useState(notification.dismissed);

    if (dismissed) {
        return <></>
    }

    let getNotificationClassNamesFromNotificationLevel = (
        level: "warning" | "error" | "success" | "info"
    ): string => {
        let notificationClassNames = "";
        switch (level) {
            case "info":
                notificationClassNames += "bg-blue-500";
                break;
            case "warning":
                notificationClassNames += "bg-yellow-200";
                break;
            case "error":
                notificationClassNames += "bg-red-500";
                break;
            case "success":
                notificationClassNames += "bg-green-500";
                break;
        }
        return notificationClassNames;
    }


    const classes = "item p-4 mb-4 flex flex-row  justify-between items-center rounded-lg " + getNotificationClassNamesFromNotificationLevel(notification.level);

    return (


        <div
            className="container flex flex-col  "
            key={notification.notificationId}
            style={{ transition: "opacity 0.3s" }}
        >
            <div className={classes} onClick={() => {
                actions[0](notification);
                return onClick(notification);
            }}>

                <div >
                    <div className="p-2">
                        <ToastIcon type={notification.level} />
                    </div>

                </div>
                <div className="flex flex-col">
                    <p className="text-lg font-bold">
                        {notification.notificationType.charAt(0).toUpperCase() + notification.notificationType.slice(1)}
                    </p>
                    <p >

                        {notification.content.length > 140 ? notification.content.substring(0, 120) + "..." : notification.content}
                    </p>

                </div>
                <button
                    className="close-btn"
                    onClick={() => {
                        setDismissed(true);
                        return onClose(notification);
                    }}
                >
                    X
                </button>
            </div>
        </div>

    );
};

export default DismissableNotification;
