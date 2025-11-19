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


// ---------------------------
// REGISTRAR USUARIO
// ---------------------------
export async function registerUser(nombre, email, password) {

  // Crear usuario en Firebase Auth
  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  // Crear documento en Firestore
  await setDoc(doc(db, "usuarios", userCred.user.uid), {
    nombre: nombre,
    puntos: 0,
    creado: Date.now()
  });

  return userCred;
}


// ---------------------------
// INICIAR SESIÓN
// ---------------------------
export function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
