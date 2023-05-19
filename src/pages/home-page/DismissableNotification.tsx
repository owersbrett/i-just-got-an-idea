import React, { useState } from "react";
import { Notification } from "../../common/types";
import '../../styles/Common.css';
import axios from "axios";

interface DismissableNotificationStackProps {
    notification: Notification;
    onClick: (notification: Notification) => void;
    onClose: (notification: Notification) => void;
    actions: [(notification: Notification) => void];
}

const DismissableNotification: React.FC<DismissableNotificationStackProps> = ({ notification, onClick, onClose, actions }) => {


    return (

        <div
            className="container flex flex-col"
            key={notification.notificationId}
            style={{ transition: "opacity 0.3s" }}
        >
            <div className="item bg-yellow-500 p-4 mb-4 flex flex-row" onClick={() => {
                actions[0](notification);
                return onClick(notification);
            }}>
                {notification.content}
                <button
                    className="close-btn"
                    onClick={() => onClose(notification)}
                >
                    X
                </button>
            </div>
        </div>

    );
};

export default DismissableNotification;
