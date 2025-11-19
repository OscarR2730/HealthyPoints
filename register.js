// register.js - Lógica de registro
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

  console.log("CLICK registro", { nombre, email });

  try {
    console.log("Antes de registerUser");
    await registerUser(nombre, email, password);
    console.log("Después de registerUser");

    alert("¡Cuenta creada con éxito! Ahora inicia sesión.");
    window.location.href = "login.html";

  } catch (e) {
    console.error("Error al registrar:", e);
    alert("Error al registrar: " + (e.message || e));

  } finally {
    btnRegister.disabled = false;
    btnRegister.textContent = originalText;
  }
});
