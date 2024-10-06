/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "asm-greenwich-sblog.firebaseapp.com",
  projectId: "asm-greenwich-sblog",
  storageBucket: "asm-greenwich-sblog.appspot.com",
  messagingSenderId: "342358622331",
  appId: "1:342358622331:web:e4c3ef4582f8b3c595a2de",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
