// habitos.js

const habitSelect = document.getElementById("habitSelect");
const btnFoto = document.getElementById("btnTomarFoto");
const btnGuardar = document.getElementById("btnGuardar");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

let stream = null;
let fotoBase64 = null;

// ===============================
// 📸 ACTIVAR CÁMARA
// ===============================
btnFoto.addEventListener("click", async () => {
  try {
    video.style.display = "block";
    canvas.style.display = "none";

    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });

    video.srcObject = stream;

    // Capturar foto al tocar el video
    video.onclick = () => {
      const ctx = canvas.getContext("2d");
      canvas.style.display = "block";

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      fotoBase64 = canvas.toDataURL("image/png");

      // detener cámara
      stream.getTracks().forEach(track => track.stop());
      video.style.display = "none";
    };

  } catch (err) {
    alert("Error al acceder a la cámara: " + err);
  }
});

// ===============================
// 💾 GUARDAR HÁBITO
// ===============================
btnGuardar.addEventListener("click", () => {
  const habito = habitSelect.value;

  if (!habito) {
    alert("Selecciona un hábito primero.");
    return;
  }

  if (!fotoBase64) {
    alert("Toma una foto como evidencia.");
    return;
  }

  alert("Hábito registrado correctamente 🎉");

  // Podrías subir fotoBase64 a Firebase Storage si deseas en futuro

  // Reset
  habitSelect.value = "";
  canvas.style.display = "none";
  fotoBase64 = null;
});
