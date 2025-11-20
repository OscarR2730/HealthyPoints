import { auth, db } from "./firebase.js";

import {
  doc,
  updateDoc,
  increment,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import { signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let btnFoto = document.getElementById("btnFoto");
let btnGuardar = document.getElementById("btnGuardar");
let habitSelect = document.getElementById("habitSelect");
let previewBadge = document.getElementById("fotoBadge");

// 🟢 SISTEMA DE PUNTOS
const habitPoints = {
  frutas: 10,
  verduras: 10,
  agua: 5,
  correr: 20,
  gimnasio: 25,
  meditacion: 15,
  caminata: 12
};

// ⭐ TU API KEY DE IMGBB
const IMGBB_API_KEY = "0a6a8d103c3be2b8620beba685c8acd7";

// --- INICIAR CÁMARA ---
btnFoto.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: "environment" } }
    });

    video.srcObject = stream;
    video.style.display = "block";
    canvas.style.display = "none";
    previewBadge.style.display = "none";

  } catch (error) {
    const fallback = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = fallback;
  }
});

// --- CAPTURAR FOTO ---
btnFoto.addEventListener("click", () => {
  const context = canvas.getContext("2d");

  // Capturar imagen
  canvas.style.display = "block";
  video.style.display = "none";

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Mostrar badge visual
  previewBadge.innerText = "📸 Foto capturada";
  previewBadge.style.display = "inline-block";

  // Detener cámara para congelar imagen
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(t => t.stop());
  }
});

// --- GUARDAR HÁBITO ---
btnGuardar.addEventListener("click", async () => {
  const habit = habitSelect.value;
  if (!habit) return alert("Selecciona un hábito.");

  const user = auth.currentUser;
  if (!user) return alert("Debes iniciar sesión.");

  try {
    // Convertir canvas a base64
    const dataUrl = canvas.toDataURL("image/png").replace("data:image/png;base64,", "");

    // Subir a imgbb
    const formData = new FormData();
    formData.append("key", IMGBB_API_KEY);
    formData.append("image", dataUrl);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData
    });

    const result = await response.json();
    if (!result.success) throw new Error("Error subiendo imagen");

    const imageUrl = result.data.url;

    // Puntos
    const puntosGanados = habitPoints[habit] || 0;
    const userRef = doc(db, "users", user.uid);

    await updateDoc(userRef, {
      points: increment(puntosGanados),
      evidencias: arrayUnion({
        habit,
        image: imageUrl,
        date: new Date().toISOString()
      })
    });

    alert(`✔ Hábito guardado\n📸 Foto subida con éxito\n+${puntosGanados} puntos`);

    window.location.href = "dashboard.html";

  } catch (err) {
    alert("Error guardando hábito o subiendo la imagen.");
    console.error(err);
  }
});

// --- CERRAR SESIÓN ---
let logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });
}
