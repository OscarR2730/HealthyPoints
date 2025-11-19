// login.js - Lógica de la pantalla de inicio de sesión
import { loginUser } from "./auth.js";

document.getElementById("btnLogin").addEventListener("click", async () => {
  const correo = document.getElementById("email").value.trim();
  const contra = document.getElementById("password").value.trim();

  if (!correo || !contra) {
    alert("Completa todos los campos.");
    return;
  }

  try {
    await loginUser(correo, contra);
    window.location.href = "dashboard.html";
  } catch (e) {
    alert("Error: " + e.message);
  }
});
