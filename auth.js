// auth.js - Funciones de autenticación básicas
import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// ---------------------------
// REGISTRAR USUARIO
// ---------------------------
export async function registerUser(nombre, email, password) {
  console.log("auth.registerUser llamado", { nombre, email });

  // Crear usuario en Firebase Auth
  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  console.log("Usuario creado en Auth:", userCred.user.uid);
  // (De momento no tocamos Firestore para evitar cuelgues raros)

  return userCred;
}

// ---------------------------
// INICIAR SESIÓN
// ---------------------------
export function loginUser(email, password) {
  console.log("auth.loginUser llamado", email);
  return signInWithEmailAndPassword(auth, email, password);
}

// ---------------------------
// CERRAR SESIÓN
// ---------------------------
export function logoutUser() {
  return signOut(auth);
}
