// habitos.js — Configurar cámara y captura

let video = document.getElementById("video");
let btnStartCamera = document.getElementById("btnStartCamera");
let btnCapture = document.getElementById("btnCapture");
let btnSave = document.getElementById("btnSaveHabit");
let habitSelect = document.getElementById("habitSelect");
let cameraContainer = document.getElementById("cameraContainer");
let capturedImage = document.getElementById("capturedImage");

let photoData = null; // Guardará la foto capturada
let stream = null;

// ================================
// 🟢 Iniciar cámara (intenta usar cámara trasera)
// ================================

btnStartCamera.addEventListener("click", async () => {
  if (!habitSelect.value) {
    alert("Primero selecciona un hábito.");
    return;
  }

  cameraContainer.style.display = "block";

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { exact: "environment" }  // TIRA A LA TRASERA
      }
    });
  } catch (e) {
    // Si la trasera NO está disponible, usa la cámara normal
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
  }

  video.srcObject = stream;
});

// ================================
// 🟡 Capturar foto
// ================================

btnCapture.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  // Guardar la imagen en base64
  photoData = canvas.toDataURL("image/png");

  capturedImage.src = photoData;
  capturedImage.style.display = "block";

  alert("Foto tomada correctamente.");
});

// ================================
// 🔵 Guardar hábito
// ================================

btnSave.addEventListener("click", () => {
  if (!habitSelect.value) {
    alert("Selecciona un hábito.");
    return;
  }

  if (!photoData) {
    alert("Debes tomar una foto como evidencia.");
    return;
  }

  // 📌 Aquí luego integremos Firebase Storage
  alert("Hábito registrado con éxito.\n(Evidencia guardada para la demo)");
});
