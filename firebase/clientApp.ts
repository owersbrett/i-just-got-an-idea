import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";

initializeApp( {
    apiKey:process.env.IJGAI_FIREBASE_API_KEY,
    authDomain:process.env.IJGAI_FIREBASE_AUTH_DOMAIN,
    projectId:process.env.IJGAI_FIREBASE_PROJECT_ID,
    storageBucket:process.env.IJGAI_FIREBASE_STORAGE_BUCKET,
    messagingSenderId:process.env.IJGAI_FIREBASE_MESSAGING_SENDER_ID,
    appId:process.env.IJGAI_FIREBASE_APP_ID,
    measurementId:process.env.IJGAI_FIREBASE_MEASUREMENT_ID
 });
 const firestore = getFirestore();

 export {firestore};
