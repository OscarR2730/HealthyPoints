import { auth, db } from "./firebase.js";

import {
  doc,
  updateDoc,
  getDoc,
  increment,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let btnFoto = document.getElementById("btnFoto");
let btnGuardar = document.getElementById("btnGuardar");
let habitSelect = document.getElementById("habitSelect");

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
      video: {
        facingMode: { exact: "environment" }
      }
    });

    video.srcObject = stream;
    video.style.display = "block";
    canvas.style.display = "none";
  } catch (error) {
    // si "environment" falla, usar cualquier cámara
    const fallback = await navigator.mediaDevices.getUserMedia({
      video: true
    });
    video.srcObject = fallback;
    video.style.display = "block";
  }
});

// --- GUARDAR HÁBITO ---
btnGuardar.addEventListener("click", async () => {
  const habit = habitSelect.value;
  if (!habit) {
    alert("Selecciona un hábito.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("Debes iniciar sesión.");
    return;
  }

  try {
    // Capturar imagen del video
    const context = canvas.getContext("2d");
    canvas.style.display = "block";
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

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

    // Actualizar Firestore
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

    alert(`Hábito guardado 🎉\n+${puntosGanados} puntos\nImagen subida correctamente`);

    // Detener cámara
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(t => t.stop());
    }

    window.location.href = "dashboard.html";

  } catch (err) {
    console.error(err);
    alert("Error guardando hábito o subiendo imagen.");
  }
});
