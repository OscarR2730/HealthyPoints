// firebase.js - Configuración central de Firebase (SDK modular v12)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Configuración proporcionada por Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBJSckyE2py57ebYOIOZeAFo8DtMOkoUew",
  authDomain: "healthy-points-27.firebaseapp.com",
  projectId: "healthy-points-27",
  storageBucket: "healthy-points-27.appspot.com",
  messagingSenderId: "532422074526",
  appId: "1:532422074526:web:2bd70c37cbd28bb891db8f",
  measurementId: "G-D2S5LSR127"
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
