// auth.js - Funciones de autenticación
import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Registro de usuario
export async function registerUser(nombre, email, password) {
  // Crear usuario en Firebase Auth
  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  // Crear documento del usuario en Firestore
  await setDoc(doc(db, "users", userCred.user.uid), {
    name: nombre,
    points: 0,
    created: Date.now()
  });

  return userCred;
}

// Inicio de sesión
export async function loginUser(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}
