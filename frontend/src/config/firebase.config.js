import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // ← EKLE

const firebaseConfig = {
  apiKey: "AIzaSyAxoEhFeuV6gvd7169BXW8dUQ1CBIr8DGI",
  authDomain: "biharclik.firebaseapp.com",
  projectId: "biharclik",
  storageBucket: "biharclik.firebasestorage.app",
  messagingSenderId: "630997986420",
  appId: "1:630997986420:web:5d8b1f35c7bcb11c6ab521"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);  // ← EKLE