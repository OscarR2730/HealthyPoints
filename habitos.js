// Detectar si el usuario está en móvil
function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

let video = document.getElementById("video");
let btnStartCamera = document.getElementById("btnStartCamera");
let btnCapture = document.getElementById("btnCapture");
let btnSave = document.getElementById("btnSaveHabit");
let habitSelect = document.getElementById("habitSelect");
let cameraContainer = document.getElementById("cameraContainer");
let capturedImage = document.getElementById("capturedImage");
let mobileCamera = document.getElementById("mobileCamera");

let photoData = null;
let stream = null;

// ================================
// 🟢 Start Camera Button
// ================================
btnStartCamera.addEventListener("click", async () => {

  if (!habitSelect.value) {
    alert("Primero selecciona un hábito.");
    return;
  }

  // 📱 En móvil → abrir cámara nativa
  if (isMobile()) {
    mobileCamera.click();
    return;
  }

  // 💻 En PC → usar getUserMedia
  cameraContainer.style.display = "block";

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
  } catch (e) {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
  }

  video.srcObject = stream;
});

// ================================
// 📱 MÓVIL: Capturar foto desde input file
// ================================
mobileCamera.addEventListener("change", () => {
  const file = mobileCamera.files[0];

  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    photoData = e.target.result;
    capturedImage.src = photoData;
    capturedImage.style.display = "block";
  };

  reader.readAsDataURL(file);

  alert("Foto tomada correctamente.");
});

// ================================
// 💻 PC: Capturar desde webcam
// ================================
btnCapture.addEventListener("click", () => {
  if (!stream) return;

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

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

  alert("Hábito registrado con éxito.\n(Evidencia lista para guardar).");
});
