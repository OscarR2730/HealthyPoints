import { auth, db } from "./firebase.js";
import {
  doc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let btnFoto = document.getElementById("btnFoto");
let btnGuardar = document.getElementById("btnGuardar");
let habitSelect = document.getElementById("habitSelect");

// ---------------- CONFIG CLOUDINARY ----------------
const CLOUD_NAME = "dyxxnexsj";
const UPLOAD_PRESET = "healthy_upload";

// ---------------- SISTEMA DE PUNTOS ----------------
const habitPoints = {
  frutas: 10,
  verduras: 10,
  agua: 5,
  correr: 20,
  gimnasio: 25,
  meditacion: 15,
  caminata: 12
};

// ----------- INICIAR CÁMARA (TRASERA EN CELULAR) -----------
btnFoto.addEventListener("click", async () => {
  try {
    const constraints = {
      video: {
        facingMode: { ideal: "environment" }, // cámara trasera
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    video.style.display = "block";
  } catch (error) {
    console.error(error);
    alert("No se pudo acceder a la cámara.");
  }
});

// ------------------- GUARDAR HÁBITO -------------------
btnGuardar.addEventListener("click", async () => {
  const habit = habitSelect.value;
  if (!habit) return alert("Selecciona un hábito.");

  const user = auth.currentUser;
  if (!user) return alert("Debes iniciar sesión.");

  // Tomar foto
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const picture = canvas.toDataURL("image/jpeg");

  try {
    // ------------ SUBIR A CLOUDINARY ------------
    const formData = new FormData();
    formData.append("file", picture);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    if (!data.secure_url) throw new Error("Fallo subida");

    // ------------ SUMAR PUNTOS EN FIRESTORE ------------
    const puntosGanados = habitPoints[habit] || 0;

    await updateDoc(doc(db, "users", user.uid), {
      points: increment(puntosGanados)
    });

    alert(`¡Hábito guardado! 🎉 +${puntosGanados} puntos`);

    // detener cámara
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(t => t.stop());
    }

    window.location.href = "dashboard.html";

  } catch (err) {
    console.error(err);
    alert("Error guardando hábito o subiendo imagen.");
  }
});
