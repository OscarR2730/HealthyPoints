// dashboard.js - Cerrar sesión
import { logoutUser } from "./auth.js";

const btnLogout = document.getElementById("btnLogout");

btnLogout.addEventListener("click", async () => {
  try {
    await logoutUser();
    window.location.href = "index.html";
  } catch (e) {
    console.error("Error al cerrar sesión:", e);
    alert("No se pudo cerrar sesión: " + (e.message || e));
  }
});
