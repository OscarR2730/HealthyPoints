// habitos.js
import { auth, db, storage } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import {
  ref,
  uploadString,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

// ================================
// ELEMENTOS DEL HTML
// ================================
const habitSelect = document.getElementById("habitSelect");
const btnFoto = document.getElementById("btnFoto");
const btnGuardar = document.getElementById("btnGuardar");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let stream = null;
let fotoBase64 = null;
let previsualizando = false;

// ================================
// 📸 MANEJO DE CÁMARA
// ================================
btnFoto.addEventListener("click", async () => {
  try {
    // Si todavía no estamos previsualizando → abrir cámara
    if (!previsualizando) {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false
      });

      video.style.display = "block";
      canvas.style.display = "none";
      video.srcObject = stream;

      btnFoto.textContent = "Capturar foto";
      previsualizando = true;
      return;
    }

    // Si ya estamos previsualizando → capturar foto
    if (previsualizando && stream) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      fotoBase64 = canvas.toDataURL("image/jpeg", 0.9);

      canvas.style.display = "block";
      video.style.display = "none";

      // Apagar la cámara
      stream.getTracks().forEach(t => t.stop());
      stream = null;

      btnFoto.textContent = "Tomar otra foto";
      previsualizando = false;
    }

  } catch (err) {
    console.error(err);
    alert("No se pudo acceder a la cámara. Revisa permisos de cámara.");
  }
});

// ================================
// 💾 GUARDAR HÁBITO + FOTO EN FIREBASE
// ================================
btnGuardar.addEventListener("click", async () => {
  const habito = habitSelect.value;

  if (!habito) {
    alert("Selecciona un hábito primero.");
    return;
  }

  if (!fotoBase64) {
    alert("Primero toma una foto como evidencia.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("No hay usuario autenticado.");
    return;
  }

  try {
    // 1. Subir la imagen a Storage
    const filePath = `evidencias/${user.uid}/${Date.now()}.jpg`;
    const storageRef = ref(storage, filePath);

    await uploadString(storageRef, fotoBase64, "data_url");
    const urlFoto = await getDownloadURL(storageRef);

    // 2. Guardar registro en Firestore
    await addDoc(collection(db, "habitos"), {
      uid: user.uid,
      habito,
      evidenciaURL: urlFoto,
      creadoEn: serverTimestamp()
    });

    alert("Hábito guardado con éxito 🎉");

    // Reset sencillo
    habitSelect.value = "";
    canvas.style.display = "none";
    fotoBase64 = null;

  } catch (err) {
    console.error("Error al guardar hábito:", err);
    alert("Ocurrió un error al guardar el hábito.");
  }
});
