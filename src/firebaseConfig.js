import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAT87fttnmC2NDkZVnMWuUYcEw57h3U1CM",
  authDomain: "posts-155e4.firebaseapp.com",
  projectId: "posts-155e4",
  storageBucket: "posts-155e4.appspot.com",
  messagingSenderId: "557663550471",
  appId: "1:557663550471:web:a83ffd38e5fbcb772efea2"
};  

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app);