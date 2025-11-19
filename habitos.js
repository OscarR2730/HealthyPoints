// ====== Captura de elementos ======
const habitSelect = document.getElementById("habitSelect");
const btnFoto = document.getElementById("btnFoto");
const btnGuardar = document.getElementById("btnGuardar");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

let fotoTomada = null;

// ========= ABRIR CÁMARA ==========
btnFoto.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }, // cámara trasera
      audio: false
    });

    video.srcObject = stream;
    video.style.display = "block";

    // Tomar foto al tocar el video
    video.onclick = () => {
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      fotoTomada = canvas.toDataURL("image/png");

      video.style.display = "none";
      canvas.style.display = "block";

      stream.getTracks().forEach(track => track.stop());
    };

  } catch (e) {
    alert("Error al acceder a la cámara: " + e.message);
  }
});

// ========= GUARDAR HÁBITO ==========
btnGuardar.addEventListener("click", () => {
  const habito = habitSelect.value;

  if (!habito) {
    alert("Selecciona un hábito antes de guardar.");
    return;
  }

  if (!fotoTomada) {
    alert("Debes tomar una foto como evidencia.");
    return;
  }

  alert("Hábito guardado con éxito ✔");

  // Aquí luego puedes enviarlo a Firebase si quieres
});
