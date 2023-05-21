import * as admin from "firebase-admin";
const serviceAccount = require("../hidden/i-just-got-an-idea-firebase-adminsdk-up0zt-bf3cc0a52f.json");

let config: any = {
  credential: admin.credential.cert(serviceAccount),
};

if (process.env.NODE_ENV === "development") {
  config.firestoreEmulatorHost = "localhost";
  config.firestoreEmulatorPort = 5001;
}

admin.initializeApp(config);
module.exports = {
  //   ...require("./sendWordNotifications.js"),
  ...require("./onEntryCreated.js"),
  // ...require("./createNotificationPreferences.js"),
};
