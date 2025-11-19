// habitos.js - Guardar hábitos en Firebase
import { auth, db } from "./firebase.js";

import {
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

document.getElementById("btnSaveHabit").addEventListener("click", async () => {

  const habit = document.getElementById("habitSelect").value;

  if (!habit) {
    alert("Por favor selecciona un hábito.");
    return;
  }

  const user = auth.currentUser;

  if (!user) {
    alert("Debes iniciar sesión.");
    window.location.href = "login.html";
    return;
  }

  try {
    await addDoc(collection(db, "habits"), {
      uid: user.uid,
      habit: habit,
      date: serverTimestamp()
    });

    alert("¡Hábito registrado con éxito!");
    document.getElementById("habitSelect").value = "";

  } catch (e) {
    console.error("Error al guardar hábito:", e);
    alert("No se pudo guardar el hábito.");
  }
});
