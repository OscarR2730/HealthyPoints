import { auth, db, storage } from "./firebase.js";

import {
  ref,
  uploadString,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

import {
  doc,
  updateDoc,
  getDoc,
  increment
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

// --- INICIAR CÁMARA ---
btnFoto.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.style.display = "block";
  } catch (error) {
    alert("No se pudo acceder a la cámara.");
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

  // Tomar foto del video
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/png");

  // Guardar en Firebase Storage
  const filePath = `evidencias/${user.uid}/${Date.now()}.png`;
  const storageRef = ref(storage, filePath);

  await uploadString(storageRef, dataUrl, "data_url");
  const imageUrl = await getDownloadURL(storageRef);

  // Actualizar puntos en Firestore
  const puntosGanados = habitPoints[habit] || 0;

  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, {
    points: increment(puntosGanados)
  });

  alert(`Hábito guardado 🎉\n+${puntosGanados} puntos obtenidos`);

  // Detener cámara
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(t => t.stop());
  }

  window.location.href = "dashboard.html";
});
