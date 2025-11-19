// auth.js - Funciones de autenticación
import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Registrar usuario y crear documento en 'usuarios'
export async function registerUser(nombre, email, password) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "usuarios", userCred.user.uid), {
    nombre,
    puntos: 0,
    creado: Date.now()
  });

  return userCred;
}

// Iniciar sesión
export function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Cerrar sesión
export function logoutUser() {
  return signOut(auth);
}
