import { FIREBASE_API_KEY, RECAPTCHA3_SITE_KEY } from "./keys";

export const environment = {
  firebaseConfig: {
    apiKey: FIREBASE_API_KEY,
    authDomain: "firebase-project-id.firebaseapp.com",
    projectId: "firebase-project-id",
    storageBucket: "firebase-project-id.appspot.com",
    messagingSenderId: "firebase-messaging-sender-id",
    appId: "firebase-app-id",
    measurementId: "firebase-analytics-measurement-id",
  },
  recaptcha3SiteKey: RECAPTCHA3_SITE_KEY,
};
