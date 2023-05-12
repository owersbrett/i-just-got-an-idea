import { Notification, } from "@/common/types";
import React, { useEffect, useState } from "react";


interface NotificationFeedProps {
    notifications: Notification[];
}

const NotificationFeed: React.FC<NotificationFeedProps> = ({ notifications }) => {
    const [showNotifications, toggleShowNotifications] = useState<boolean>(true);

    useEffect(() => {
        if (showNotifications) {
            // show notifications
        } else {
            // hide notifications
        }
    }, [showNotifications]);

    const toggleNotifications = () => {
        toggleShowNotifications(!showNotifications);
    }

    return (
        <div className="notification-feed">
            <button className="notification-collapse" onClick={toggleNotifications}>Collapse</button>
            {showNotifications ? notifications.map((notification, index) => (
                <div key={notification.notificationId} className="notification">
                    <div className="notification-header">
                        <span className="notification-type">{notification.notificationType}</span>
                    </div>
                    <div className="notification-content">
                        {notification.content}
                    </div>
                </div>
            )) : notifications.length > 0 ? <div key={notifications[0].notificationId} className="notification">
                <div className="notification-header">
                    <span className="notification-type">{notifications[0].notificationType}</span>
                </div>
                <div className="notification-content">
                    {notifications[0].content}
                </div>
            </div> : <></>}


        </div>
    );
};

export default NotificationFeed;
