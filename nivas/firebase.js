// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBN6rvXlst7xu5m7MCOpapxp3yBC_QvTdE",
  authDomain: "civicfix-601b0.firebaseapp.com",
  projectId: "civicfix-601b0",
  storageBucket: "civicfix-601b0.firebasestorage.app",
  messagingSenderId: "665947833678",
  appId: "1:665947833678:web:fe65852e8495f396e64a1f",
  measurementId: "G-53GECJTXVT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);