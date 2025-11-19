// dashboard.js - Lógica del menú principal
import { watchAuth, logout, getCurrentUserProfile } from "./auth.js";

const welcomeEl = document.getElementById("welcome");
const logoutBtn = document.getElementById("logout");

// Vigilar el estado de autenticación
watchAuth(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {
    const profile = await getCurrentUserProfile(user);
    const name =
      (profile && (profile.name || profile.nombre)) ||
      user.displayName ||
      user.email;

    welcomeEl.innerText = "Bienvenido, " + name;
  } catch (e) {
    console.error(e);
    welcomeEl.innerText = "Bienvenido";
  }
});

// Botón de cerrar sesión
logoutBtn.addEventListener("click", async () => {
  try {
    await logout();
  } catch (e) {
    alert("No se pudo cerrar sesión: " + e.message);
  }
});
