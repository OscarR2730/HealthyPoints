// habitos.js
import { auth, db } from "./firebase.js";
import {
  doc,
  updateDoc,
  increment,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

document.getElementById("btnRegistrarHabito").addEventListener("click", async () => {
  const habit = document.getElementById("habitSelect").value;

  if (!habit) {
    alert("Por favor selecciona un hábito.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("Debes iniciar sesión.");
    return;
  }

  try {
    const ref = doc(db, "users", user.uid);

    await updateDoc(ref, {
      points: increment(10),
      habits: arrayUnion({
        habit: habit,
        date: new Date().toISOString()
      })
    });

    alert("Hábito registrado con éxito. ¡Ganaste 10 puntos!");

  } catch (e) {
    console.error("Error guardando hábito:", e);
    alert("Error guardando hábito.");
  }
});
