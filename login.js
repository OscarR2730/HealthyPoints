// login.js - Lógica de inicio de sesión
import { loginUser } from "./auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Completa todos los campos.");
    return;
  }

  btnLogin.disabled = true;
  const originalText = btnLogin.textContent;
  btnLogin.textContent = "Ingresando...";

  try {
    await loginUser(email, password);
    window.location.href = "dashboard.html";
  } catch (e) {
    console.error("Error al iniciar sesión:", e);
    alert("Error al iniciar sesión: " + (e.message || e));
  } finally {
    btnLogin.disabled = false;
    btnLogin.textContent = originalText;
  }
});
