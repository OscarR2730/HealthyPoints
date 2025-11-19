// progreso.js
import { db } from "./firebase.js";
import { watchAuth } from "./auth.js";
import {
 doc, getDoc, collection, query, where, orderBy, getDocs
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const totalPoints=document.getElementById("totalPoints");
const habitList=document.getElementById("habitList");
let currentUser=null;

watchAuth(async u=>{
 if(!u) return location.href="login.html";
 currentUser=u;
 await loadPoints();
 await loadHabits();
});

async function loadPoints(){
 const snap=await getDoc(doc(db,"users",currentUser.uid));
 totalPoints.textContent=`Tienes ${snap.data()?.points||0} puntos.`;
}

async function loadHabits(){
 habitList.innerHTML="Cargando...";
 const q=query(collection(db,"habits"),
   where("userId","==",currentUser.uid),
   orderBy("createdAt","desc"));
 const s=await getDocs(q);
 if(s.empty){ habitList.innerHTML="<li>No hay hábitos.</li>"; return; }
 habitList.innerHTML="";
 s.forEach(d=>{
  const h=d.data();
  const li=document.createElement("li");
  const dt=h.createdAt?.toDate ? h.createdAt.toDate().toLocaleString():"";
  li.innerHTML=`<strong>${h.habitName}</strong> - ${h.points} pts<br><small>${dt}</small>`;
  habitList.appendChild(li);
 });
}
