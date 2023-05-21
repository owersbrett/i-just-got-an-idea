import { Notification } from "../common/types/notification"

import React, { useState } from "react";
import '../styles/Common.css';
import axios from "axios";
import ToastIcon from "./ToastIcon";
import { NotificationUtility } from "@/utils/NotificationUtility";


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
    const classes = "item p-4 mb-4 flex flex-row  justify-between items-center rounded-lg bg-yellow-500 " + NotificationUtility.getNotificationClassNamesFromNotificationLevel(notification.level);

    return (


        <div
            className="container flex flex-col text-lg font-bold "
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
                <p >

                    {notification.content.length > 33 ? notification.content.substring(0, 33) + "..." : notification.content}
                </p>
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
