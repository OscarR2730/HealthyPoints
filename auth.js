// auth.js
import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// 🔥 ESTA FUNCIÓN ES LA CLAVE
export async function registerUser(nombre, email, password) {

  // 1) Crear usuario en Firebase Auth
  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  // 2) Crear documento del usuario en Firestore
  await setDoc(doc(db, "users", userCred.user.uid), {
    name: nombre,
    points: 0,
    created: Date.now()
  });

  // 3) Devolver credenciales correctamente (antes no lo hacías)
  return userCred;
}
