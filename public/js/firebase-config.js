import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Get these values from Firebase Console → Project Settings → Your apps → Web app config
const firebaseConfig = {
  apiKey: "AIzaSyDeEBHLXJ2YLSkeU8W-cPh7KnFKjBoZ4q0",
  authDomain: "camdevsite.firebaseapp.com",
  projectId: "camdevsite",
  storageBucket: "camdevsite.firebasestorage.app",
  messagingSenderId: "977617478668",
  appId: "1:977617478668:web:6784cc787e7947c4dd3a29"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
