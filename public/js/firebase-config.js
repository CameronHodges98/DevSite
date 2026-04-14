import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Get these values from Firebase Console → Project Settings → Your apps → Web app config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "camdevsite.firebaseapp.com",
  projectId: "camdevsite",
  storageBucket: "camdevsite.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
