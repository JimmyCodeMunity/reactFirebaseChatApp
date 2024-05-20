// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCL99f9dc4QF51yb6r8JSipIPzjuIG1l2E",
  authDomain: "convo-f3d68.firebaseapp.com",
  projectId: "convo-f3d68",
  storageBucket: "convo-f3d68.appspot.com",
  messagingSenderId: "156582632479",
  appId: "1:156582632479:web:a28e118dd66b104848492a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();

export const storage = getStorage();
export const db = getFirestore();