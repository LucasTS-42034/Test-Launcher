// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDDVuVI1iTbHQdTONGvh_bc8vR7r-2fnM",
  authDomain: "test-launcher-1c876.firebaseapp.com",
  projectId: "test-launcher-1c876",
  storageBucket: "test-launcher-1c876.firebasestorage.app",
  messagingSenderId: "89499377152",
  appId: "1:89499377152:web:a9326bb44db51dd75482e5",
  measurementId: "G-Y21REFYTDB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
