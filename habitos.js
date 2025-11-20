/***************************************************
 *  IMPORTS FIREBASE
 ***************************************************/
import { auth, db } from "./firebase.js";

import {
  doc,
  updateDoc,
  getDoc,
  increment
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/***************************************************
 *  CLOUDINARY CONFIG
 ***************************************************/
const CLOUD_NAME = "dyxxnexsj";          // ← tu cloud_name
const UPLOAD_PRESET = "healthy_upload";  // ← tu preset creado

/***************************************************
 *  ELEMENTOS DEL DOM
 ***************************************************/
let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let btnFoto = document.getElementById("btnFoto");
let btnGuardar = document.getElementById("btnGuardar");
let habitSelect = document.getElementById("habitSelect");

/***************************************************
 *   SISTEMA DE PUNTOS
 ***************************************************/
const habitPoints = {
  frutas: 10,
  verduras: 10,
  agua: 5,
  correr: 20,
  gimnasio: 25,
  meditacion: 15,
  caminata: 12
};

/***************************************************
 *   INICIAR CÁMARA (TRASERA EN MÓVIL)
 ***************************************************/
btnFoto.addEventListener("click", async () => {
  try {
    const constraints = {
      video: {
        facingMode: { ideal: "environment" }  // ← cámara trasera
      },
      audio: false
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    video.srcObject = stream;
    video.style.display = "block";

  } catch (error) {
    console.error(error);
    alert("No se pudo acceder a la cámara.");
  }
});

/***************************************************
 *   GUARDAR HÁBITO + FOTO
 ***************************************************/
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

  /***************************************************
   *   CAPTURAR FOTO DESDE EL VIDEO
   ***************************************************/
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL("image/png");

  /***************************************************
   *   SUBIR FOTO A CLOUDINARY
   ***************************************************/
  try {
    const formData = new FormData();
    formData.append("file", dataUrl);
    formData.append("upload_preset", UPLOAD_PRESET);

    const cloudinaryUrl = 
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formData
    });

    const uploadResult = await response.json();

    if (!uploadResult.secure_url) {
      throw new Error("Error al subir imagen a Cloudinary");
    }

    const imageUrl = uploadResult.secure_url;

    /***************************************************
     *   SUMAR PUNTOS EN FIRESTORE
     ***************************************************/
    const puntosGanados = habitPoints[habit] || 0;

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      points: increment(puntosGanados)
    });

    alert(`Hábito guardado 🎉\n+${puntosGanados} puntos obtenidos`);

    /***************************************************
     *   DETENER CÁMARA
     ***************************************************/
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(t => t.stop());
    }

    /***************************************************
     *   REDIRIGIR
     ***************************************************/
    window.location.href = "dashboard.html";

  } catch (error) {
    console.error(error);
    alert("Error guardando hábito o subiendo imagen.");
  }
});
