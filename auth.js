// register.js - Registro de usuario

import { registerUser } from "./auth.js";

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const btnRegister = document.getElementById("btnRegister");

btnRegister.addEventListener("click", async () => {
  const nombre = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!nombre || !email || !password) {
    alert("Por favor completa todos los campos.");
    return;
  }

  btnRegister.disabled = true;
  const originalText = btnRegister.textContent;
  btnRegister.textContent = "Registrando...";

  try {
    await registerUser(nombre, email, password);

    alert("¡Cuenta creada con éxito! Ahora inicia sesión.");
    window.location.href = "login.html";

  } catch (e) {
    console.error("Error al registrar:", e);

    if (e.code === "auth/email-already-in-use") {
      alert("Ese correo ya está registrado. Inicia sesión.");
      window.location.href = "login.html";
    } else {
      alert("Error: " + e.message);
    }

  } finally {
    btnRegister.disabled = false;
    btnRegister.textContent = originalText;
  }
});
