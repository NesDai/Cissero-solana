// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAz3X-qXe93csiV1EVGqflMNeuayeLlCMY",
    authDomain: "solana-cessiro.firebaseapp.com",
    projectId: "solana-cessiro",
    storageBucket: "solana-cessiro.firebasestorage.app",
    messagingSenderId: "529693268005",
    appId: "1:529693268005:web:04bb906a058508cac547cc",
    measurementId: "G-6BCYVELL3E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);