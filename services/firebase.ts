import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB71Ps4M3pkO9Y9YbZtQtcnta8mwXR-luU",
  authDomain: "happy-70335.firebaseapp.com",
  databaseURL: "https://happy-70335-default-rtdb.firebaseio.com",
  projectId: "happy-70335",
  storageBucket: "happy-70335.firebasestorage.app",
  messagingSenderId: "471068695841",
  appId: "1:471068695841:web:583eccd3c92b236d123260",
  measurementId: "G-SD1EHGBRP9"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);