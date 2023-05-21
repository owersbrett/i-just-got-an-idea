export class NotificationUtility {
  public static getNotificationClassNamesFromNotificationLevel(
    level: "warning" | "error" | "success" | "info"
  ): string {
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
}
