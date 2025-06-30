import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZmh_eoSgBqkxhrdw5QfQly1uVpCQA0cU",
  authDomain: "wedding-8bf55.firebaseapp.com",
  projectId: "wedding-8bf55",
  storageBucket: "wedding-8bf55.firebasestorage.app",
  messagingSenderId: "362428044475",
  appId: "1:362428044475:web:fc1c15b107cef4bf06859e",
  measurementId: "G-8RFG3XD3BW"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
