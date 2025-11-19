// habitos.js - full code
import { auth, db, storage } from "./firebase.js";
import { watchAuth } from "./auth.js";
import {
  collection, addDoc, serverTimestamp, doc, updateDoc, increment
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

const habitSelect = document.getElementById("habitSelect");
const photoInput = document.getElementById("photoInput");
const btnSaveHabit = document.getElementById("btnSaveHabit");
const habitStatus = document.getElementById("habitStatus");

let currentUser=null;
watchAuth(u=>{ if(!u) location.href="login.html"; currentUser=u; });

const HABITS={
 agua:{name:"Tomar agua (8 vasos)",points:10},
 fruta:{name:"Comer fruta",points:8},
 caminar:{name:"Caminar 30 minutos",points:15},
 desayuno:{name:"Desayuno saludable",points:12},
 sin_gaseosa:{name:"Día sin gaseosa",points:10},
};

btnSaveHabit.onclick=async()=>{
 if(!currentUser)return alert("Inicia sesión");
 const key=habitSelect.value;
 const file=photoInput.files[0];
 if(!key)return alert("Selecciona un hábito");
 if(!file)return alert("Sube una foto");

 const habit=HABITS[key];
 try{
  btnSaveHabit.disabled=true;
  btnSaveHabit.textContent="Guardando...";
  const path=`evidencias/${currentUser.uid}/${Date.now()}_${file.name}`;
  const sref=ref(storage,path);
  await uploadBytes(sref,file);
  const url=await getDownloadURL(sref);

  await addDoc(collection(db,"habits"),{
    userId:currentUser.uid, habitKey:key, habitName:habit.name,
    points:habit.points, photoUrl:url, createdAt:serverTimestamp()
  });

  await updateDoc(doc(db,"users",currentUser.uid),{
    points: increment(habit.points)
  });

  habitStatus.textContent=`Hábito registrado: ${habit.name}. +${habit.points} pts`;
  setTimeout(()=>location.href="progreso.html",1500);
 }catch(e){ alert("Error: "+e.message);} 
 finally{
  btnSaveHabit.disabled=false;
  btnSaveHabit.textContent="Guardar hábito";
 }
};
