import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3veznhHhELkYqQWqqnCWWdntdKjugoUA",
  authDomain: "my-health-agent.firebaseapp.com",
  projectId: "my-health-agent",
  storageBucket: "my-health-agent.firebasestorage.app,
  messagingSenderId: "575524026210",
  appId: "1:575524026210:web:0853b9a084a8cb086c9e3b",
  measurementId: "G-KYBWHRF2E9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
