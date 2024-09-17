// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCZKrObmqY43CmYaicgGw-gJ7FriLEfvxg",
    authDomain: "immersion-react-native.firebaseapp.com",
    databaseURL: "https://immersion-react-native-default-rtdb.firebaseio.com",
    projectId: "immersion-react-native",
    storageBucket: "immersion-react-native.appspot.com",
    messagingSenderId: "28474693756",
    appId: "1:28474693756:web:a8a7811547a6db48f891f9",
    measurementId: "G-LMT9T9Q4J7"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE = getFirestore(FIREBASE_APP);
