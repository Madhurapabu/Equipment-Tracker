import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB1-ri1bVXfF21pKe5CIIDPAtdSCjFAtGI",
    authDomain: "equipment-tracking-8a51a.firebaseapp.com",
    databaseURL: "https://equipment-tracking-8a51a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "equipment-tracking-8a51a",
    storageBucket: "equipment-tracking-8a51a.appspot.com",
    messagingSenderId: "86023566044",
    appId: "1:86023566044:web:4444479a790a907889fa19",
    measurementId: "G-F14GJP1XBR"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  setPersistence(auth, browserLocalPersistence);
  
  export { auth, db };