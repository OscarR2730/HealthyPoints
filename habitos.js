import { auth, db, storage } from "./firebase.js";
import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  ref,
  uploadString,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";


// ================================
// ELEMENTOS DEL HTML
// ================================
const habitSelect = document.getElementById("habitSelect");
const btnFoto = document.getElementById("btnFoto");
const btnGuardar = document.getElementById("btnGuardar");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let fotoBase64 = null;  // Aquí guardamos la foto tomada


// ================================
// ABRIR CÁMARA (PC y CELULAR)
// ================================
btnFoto.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" }  // Usa cámara trasera en celulares
      }
    });

    video.style.display = "block";
    video.srcObject = stream;

    // Tomar foto al hacer clic nuevamente
    btnFoto.textContent = "Capturar foto";
    
    btnFoto.onclick = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.style.display = "block";

      // Guardar foto en Base64
      fotoBase64 = canvas.toDataURL("image/jpeg", 0.9);

      // Apagar cámara
      const tracks = stream.getTracks();
      tracks.forEach(t => t.stop());

      video.style.display = "none";
      btnFoto.textContent = "Tomar foto";
      btnFoto.onclick = null; // Restaurar después
      btnFoto.addEventListener("click", restartCamera);
    };

  } catch (error) {
    alert("No se pudo acceder a la cámara.");
    console.error(error);
  }
});


function restartCamera() {
  location.reload();
}


// ================================
// GUARDAR HÁBITO EN FIRESTORE + FOTO EN STORAGE
// ================================
btnGuardar.addEventListener("click", async () => {

  const habitSelected = habitSelect.value.trim();

  if (!habitSelected) {
    alert("Por favor selecciona un hábito.");
    return;
  }

  if (!fotoBase64) {
    alert("Primero debes tomar una foto como evidencia.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("No hay usuario autenticado.");
    return;
  }

  try {
    // ================================
    // 1. SUBIR FOTO A STORAGE
    // ================================
    const fileName = `evidencias/${user.uid}/${Date.now()}.jpg`;
    const storageRef = ref(storage, fileName);

    // Subir cadena Base64
    await uploadString(storageRef, fotoBase64, "data_url");

    // Obtener URL de descarga
    const imageURL = await getDownloadURL(storageRef);


    // ================================
    // 2. GUARDAR INFORMACIÓN EN FIRESTORE
    // ================================
    await addDoc(collection(db, "habitos"), {
      uid: user.uid,
      habito: habitSelected,
      fecha: serverTimestamp(),
      evidenciaURL: imageURL
    });

    alert("Hábito guardado con éxito 🎉");

    // Reiniciar página
    location.reload();

  } catch (error) {
    console.error("Error guardando hábito:", error);
    alert("Ocurrió un error guardando el hábito.");
  }
});
