// dashboard.js — Manejo del botón Cerrar sesión

import { auth } from "./firebase.js";
import {
  signOut
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Botón de cerrar sesión
const btnLogout = document.getElementById("btnLogout");

// Verificar que el botón exista (por si GitHub Pages carga lento)
if (btnLogout) {
  btnLogout.addEventListener("click", async () => {
    try {
      await signOut(auth);
      console.log("Sesión cerrada correctamente.");
      window.location.href = "index.html";
    } catch (e) {
      console.error("Error al cerrar sesión:", e);
      alert("No se pudo cerrar sesión: " + (e.message || e));
    }
  });
} else {
  console.error("❌ No se encontró el botón btnLogout en el DOM");
}
