import { auth, db } from "./firebase.js";

import {
  doc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

//////////////////////////////////////////////////
//  CLOUDINARY CONFIG  (REEMPLAZA CON TUS DATOS)
//////////////////////////////////////////////////
const CLOUD_NAME = "dyxxnexsj";        // tu cloud_name
const UPLOAD_PRESET = "default_preset"; // tu upload preset (revisa en Cloudinary)
const CLOUD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

//////////////////////////////////////////////////
//  ELEMENTOS HTML
//////////////////////////////////////////////////
let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let btnFoto = document.getElementById("btnFoto");
let btnGuardar = document.getElementById("btnGuardar");
let habitSelect = document.getElementById("habitSelect");

//////////////////////////////////////////////////
//  SISTEMA DE PUNTOS
//////////////////////////////////////////////////
const habitPoints = {
  frutas: 10,
  verduras: 10,
  agua: 5,
  correr: 20,
  gimnasio: 25,
  meditacion: 15,
  caminata: 12
};

//////////////////////////////////////////////////
//  OBTENER CÁMARA TRASERA EN ANDROID + iPHONE
//////////////////////////////////////////////////

function getRearCameraConfig() {
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isIOS) {
    return { video: { facingMode: "environment" } };
  }

  // Android y otros
  return { video: { facingMode: { exact: "environment" } } };
}

//////////////////////////////////////////////////
//  INICIAR CÁMARA
//////////////////////////////////////////////////
btnFoto.addEventListener("click", async () => {
  try {
    const config = getRearCameraConfig();

    const stream = await navigator.mediaDevices.getUserMedia(config);

    video.srcObject = stream;
    video.style.display = "block";
    canvas.style.display = "none";

  } catch (error) {
    console.error("Error cámara:", error);
    alert("No se pudo acceder a la cámara trasera. Revisa permisos.");
  }
});

//////////////////////////////////////////////////
//  SUBIR A CLOUDINARY
//////////////////////////////////////////////////
async function uploadToCloudinary(dataUrl) {
  const formData = new FormData();
  formData.append("file", dataUrl);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(CLOUD_URL, {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  return data.secure_url; // URL final
}

//////////////////////////////////////////////////
//  GUARDAR HÁBITO
//////////////////////////////////////////////////
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
  canvas.style.display = "block";
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/png");

  // Subir imagen a Cloudinary
  const imageUrl = await uploadToCloudinary(dataUrl);

  // Actualizar puntos del usuario
  const puntosGanados = habitPoints[habit] || 0;

  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, {
    points: increment(puntosGanados)
  });

  alert(`Hábito guardado 🎉\nFoto subida📸\n+${puntosGanados} puntos`);

  // Detener cámara
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(t => t.stop());
  }

  window.location.href = "dashboard.html";
});
