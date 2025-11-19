// recompensas.js
import { db } from "./firebase.js";
import { watchAuth } from "./auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const pointsInfo=document.getElementById("pointsInfo");
const box=document.getElementById("rewardsContainer");
let currentUser=null;

const REWARDS=[
 {name:"Descuento comida saludable",cost:100},
 {name:"1 mes Spotify Premium",cost:250},
 {name:"Gift card saludable",cost:400}
];

watchAuth(async u=>{
 if(!u) return location.href="login.html";
 currentUser=u;
 await load();
});

async function load(){
 const snap=await getDoc(doc(db,"users",currentUser.uid));
 const pts=snap.data()?.points||0;
 pointsInfo.textContent=`Tienes ${pts} puntos.`;

 box.innerHTML="";
 REWARDS.forEach(r=>{
  const falta=r.cost-pts;
  const ok=falta<=0;
  box.innerHTML+=`
    <div style="margin-bottom:16px;">
      <strong>${r.name}</strong><br>
      Puntos requeridos: ${r.cost}<br>
      ${ ok ? "<span style='color:#2f8e48;'>Puedes canjear.</span>"
            : "<span style='color:#c65353;'>Te faltan "+falta+" pts.</span>"}
    </div>`;
 });
}
