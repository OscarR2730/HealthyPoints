import { auth, db } from "./firebase.js";
import {
  doc,
  updateDoc,
  increment,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const btnFoto = document.getElementById("btnFoto");
const btnCapturar = document.getElementById("btnCapturar");
const btnGuardar = document.getElementById("btnGuardar");
const habitSelect = document.getElementById("habitSelect");
const previewBadge = document.getElementById("fotoBadge");

let stream = null;

// ================================
// 1. ABRIR CÁMARA
// ================================
btnFoto.addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    video.style.display = "block";
    canvas.style.display = "none";
    previewBadge.style.display = "none";

    btnFoto.style.display = "none";             
    btnCapturar.style.display = "inline-block"; 
    btnGuardar.style.display = "none";

  } catch (error) {
    alert("No se pudo acceder a la cámara.");
    console.error(error);
  }
});

// ================================
// 2. CAPTURAR FOTO
// ================================
btnCapturar.addEventListener("click", () => {
  const context = canvas.getContext("2d");

  canvas.style.display = "block";
  video.style.display = "none";

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
  }

  previewBadge.innerText = "📸 Foto capturada";
  previewBadge.style.display = "inline-block";

  btnFoto.style.display = "inline-block";
  btnCapturar.style.display = "none";
  btnGuardar.style.display = "inline-block";
});

// ================================
// PUNTOS POR HÁBITO
// ================================
const habitPoints = {
  frutas: 10,
  verduras: 10,
  agua: 5,
  correr: 20,
  gimnasio: 25,
  meditacion: 15,
  caminata: 12
};

// TU API KEY DE IMGBB
const IMGBB_API_KEY = "0a6a8d103c3be2b8620beba685c8acd7";

// ================================
// 3. GUARDAR HÁBITO
// ================================
btnGuardar.addEventListener("click", async () => {
  const habit = habitSelect.value;
  if (!habit) return alert("Selecciona un hábito.");

  const user = auth.currentUser;
  if (!user) return alert("Debes iniciar sesión.");

  try {
    const dataUrl = canvas.toDataURL("image/png").replace("data:image/png;base64,", "");

    const formData = new FormData();
    formData.append("key", IMGBB_API_KEY);
    formData.append("image", dataUrl);

    const res = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (!result.success) throw new Error("Error subiendo imagen");

    const puntosGanados = habitPoints[habit] || 0;
    const userRef = doc(db, "users", user.uid);

    await updateDoc(userRef, {
      points: increment(puntosGanados),
      evidencias: arrayUnion({
        habit,
        image: result.data.url,
        date: new Date().toISOString(),
      }),
    });

    alert(`✔ Hábito guardado\n📸 Foto subida con éxito\n+${puntosGanados} puntos`);
    window.location.href = "dashboard.html";

  } catch (err) {
    alert("Error guardando hábito.");
    console.error(err);
  }
});
